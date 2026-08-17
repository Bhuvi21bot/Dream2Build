"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplitConnectors = void 0;
const identity_1 = require("./identity");
function resolveProxyTarget(url, proxyBase) {
    if (url.startsWith(proxyBase)) {
        return url;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        const parsed = new URL(url);
        return `${proxyBase}${parsed.pathname}${parsed.search}`;
    }
    return `${proxyBase}${url.startsWith('/') ? '' : '/'}${url}`;
}
function flattenHeaders(headers) {
    if (!headers) {
        return {};
    }
    const result = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            result[key] = value;
        });
    }
    else if (Array.isArray(headers)) {
        for (const pair of headers) {
            result[pair[0]] = pair[1];
        }
    }
    else {
        Object.assign(result, headers);
    }
    return result;
}
/**
 * Per-connector strategies for shaping the `host` + `token` pair returned by
 * `getCliConfig()`. Different partner CLIs require different layouts:
 *
 *   - `dbx-compound-token`: the Databricks Go SDK (and CLIs built on it)
 *     strip the path from `*_HOST`, so routing data has to ride along
 *     inside the token. Used by `databricks` (U2M) and `databricks-m2m`.
 *
 *   - `path-route`: the CLI preserves the full URL path of `*_API_URL`,
 *     so the connector name + connection id can be encoded directly in
 *     the URL. Used by `microsoft-fabric` for the Rayfin CLI.
 *
 * Adding a new connector? Pick whichever strategy matches the partner
 * CLI's behavior — never invent a third format unless the CLI literally
 * cannot consume either of the two above.
 */
const dbxCompoundTokenStrategy = ({ baseUrl, connectorName, connectionId, rawIdentityToken, }) => ({
    host: baseUrl,
    token: `${rawIdentityToken} dbx:${connectionId}`,
    connectorName,
});
const pathRouteStrategy = ({ baseUrl, connectorName, connectionId, rawIdentityToken, }) => ({
    host: `${baseUrl}/api/v2/cli-proxy/${connectorName}/${connectionId}`,
    token: rawIdentityToken,
    connectorName,
});
const CLI_CONFIG_STRATEGIES = {
    databricks: dbxCompoundTokenStrategy,
    'databricks-m2m': dbxCompoundTokenStrategy,
    'microsoft-fabric': pathRouteStrategy,
    datadog: pathRouteStrategy,
};
class ReplitConnectors {
    constructor(options) {
        this.baseUrl = options?.baseUrl ?? (0, identity_1.resolveBaseUrl)();
    }
    async proxy(connectorName, path, options) {
        const method = options?.method ?? 'GET';
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = `${this.getProxyUrl()}${normalizedPath}`;
        const headers = {
            ...(await (0, identity_1.buildHeaders)()),
            'Connector-Name': connectorName,
            ...(options?.headers ?? {}),
        };
        const init = { method, headers };
        if (options?.body !== undefined && options.body !== null) {
            if (typeof options.body === 'string' ||
                (typeof Buffer !== 'undefined' && options.body instanceof Buffer) ||
                options.body instanceof ArrayBuffer ||
                options.body instanceof FormData ||
                options.body instanceof URLSearchParams ||
                options.body instanceof Blob ||
                options.body instanceof ReadableStream) {
                init.body = options.body;
            }
            else {
                init.body = JSON.stringify(options.body);
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }
        }
        const response = await fetch(url, init);
        if (response.status === 401) {
            const freshAuth = await (0, identity_1.buildHeaders)();
            const retryResponse = await fetch(url, {
                ...init,
                headers: { ...headers, ...freshAuth },
            });
            return retryResponse;
        }
        return response;
    }
    async listConnections(options) {
        const params = new URLSearchParams();
        if (options?.connector_names) {
            params.set('connector_names', options.connector_names);
        }
        for (const val of options?.expand ?? ['connector']) {
            params.append('expand', val);
        }
        params.set('refresh_policy', options?.refresh_policy ?? 'none');
        const qs = params.toString();
        const url = `${this.baseUrl}/api/v2/connection${qs ? `?${qs}` : ''}`;
        const headers = await (0, identity_1.buildHeaders)();
        const response = await fetch(url, { method: 'GET', headers });
        if (response.status === 401) {
            const freshHeaders = await (0, identity_1.buildHeaders)();
            const retryResponse = await fetch(url, {
                method: 'GET',
                headers: freshHeaders,
            });
            if (!retryResponse.ok) {
                throw new Error(`Failed to list connections: ${retryResponse.status} ${retryResponse.statusText}`);
            }
            const data = (await retryResponse.json());
            return data.items ?? [];
        }
        if (!response.ok) {
            throw new Error(`Failed to list connections: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.items ?? [];
    }
    getProxyUrl() {
        return `${this.baseUrl}/api/v2/proxy`;
    }
    async getProxyHeaders(connectorName) {
        const headers = await (0, identity_1.buildHeaders)();
        return { ...headers, 'Connector-Name': connectorName };
    }
    async getCliConfig(connectorName) {
        const strategy = CLI_CONFIG_STRATEGIES[connectorName];
        if (!strategy) {
            const supported = Object.keys(CLI_CONFIG_STRATEGIES).join(', ');
            throw new Error(`getCliConfig() is only supported for ${supported}, got: ${connectorName}`);
        }
        const connections = await this.listConnections({
            connector_names: connectorName,
        });
        const connection = connections[0];
        if (!connection) {
            throw new Error(`No ${connectorName} connection found`);
        }
        const headers = await (0, identity_1.buildHeaders)();
        const identityToken = headers['X-Replit-Token'] ?? headers['Replit-Authentication'];
        if (!identityToken) {
            throw new Error('Replit identity token not found');
        }
        const rawToken = identityToken.replace(/^Bearer\s+/i, '');
        return strategy({
            baseUrl: this.baseUrl,
            connectorName,
            connectionId: connection.id,
            rawIdentityToken: rawToken,
        });
    }
    createProxyFetch(connectorName) {
        const proxyBase = this.getProxyUrl();
        return async (input, init) => {
            const rawUrl = input instanceof Request ? input.url : String(input);
            const targetUrl = resolveProxyTarget(rawUrl, proxyBase);
            const authHeaders = await (0, identity_1.buildHeaders)();
            const userHeaders = flattenHeaders(init?.headers ?? (input instanceof Request ? input.headers : undefined));
            const headers = {
                ...authHeaders,
                'Connector-Name': connectorName,
                ...userHeaders,
            };
            const requestDefaults = input instanceof Request
                ? {
                    method: input.method,
                    body: input.body,
                    cache: input.cache,
                    credentials: input.credentials,
                    integrity: input.integrity,
                    keepalive: input.keepalive,
                    mode: input.mode,
                    redirect: input.redirect,
                    referrer: input.referrer,
                    referrerPolicy: input.referrerPolicy,
                    signal: input.signal,
                    // @ts-expect-error duplex is required for streaming bodies but missing from RequestInit
                    duplex: input.body ? 'half' : undefined,
                }
                : {};
            const fetchInit = { ...requestDefaults, ...init, headers };
            const response = await fetch(targetUrl, fetchInit);
            if (response.status === 401) {
                const freshAuth = await (0, identity_1.buildHeaders)();
                return fetch(targetUrl, {
                    ...fetchInit,
                    headers: {
                        ...freshAuth,
                        'Connector-Name': connectorName,
                        ...userHeaders,
                    },
                });
            }
            return response;
        };
    }
}
exports.ReplitConnectors = ReplitConnectors;
//# sourceMappingURL=client.js.map