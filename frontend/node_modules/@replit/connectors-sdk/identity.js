"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAudience = resolveAudience;
exports.createIdentityToken = createIdentityToken;
exports.resolveIdentityToken = resolveIdentityToken;
exports.resolveBaseUrl = resolveBaseUrl;
exports.buildHeaders = buildHeaders;
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
const DEFAULT_CONNECTORS_HOST = 'connectors.replit.com';
function resolveAudience() {
    const audience = process.env['REPLIT_CONNECTORS_AUDIENCE'];
    if (audience) {
        if (audience.startsWith('http://') || audience.startsWith('https://')) {
            return audience;
        }
        return `https://${audience}`;
    }
    return `https://${DEFAULT_CONNECTORS_HOST}`;
}
async function createIdentityToken() {
    const replitBinary = process.env['REPLIT_CLI'] || 'replit';
    const audience = resolveAudience();
    const { stdout } = await execFileAsync(replitBinary, [
        'identity',
        'create',
        '--audience',
        audience,
    ]);
    const token = stdout.trim();
    if (!token) {
        throw new Error(`replit identity create returned an empty token (audience: ${audience})`);
    }
    return token;
}
async function resolveIdentityToken() {
    try {
        const token = await createIdentityToken();
        return token;
    }
    catch {
        // CLI not available — fall through to env var strategies
    }
    const replIdentity = process.env['REPL_IDENTITY'];
    if (replIdentity) {
        return `repl ${replIdentity}`;
    }
    const deplToken = process.env['WEB_REPL_RENEWAL'];
    if (deplToken) {
        return `depl ${deplToken}`;
    }
    throw new Error('Replit identity token not found. ' +
        'Could not run `replit identity create` and neither ' +
        'REPL_IDENTITY nor WEB_REPL_RENEWAL are set in the environment. ' +
        'Are you running this inside a Repl?');
}
function resolveBaseUrl() {
    const hostname = process.env['REPLIT_CONNECTORS_HOSTNAME'];
    if (hostname) {
        if (hostname.startsWith('http://') || hostname.startsWith('https://')) {
            return hostname;
        }
        return `https://${hostname}`;
    }
    return `https://${DEFAULT_CONNECTORS_HOST}`;
}
async function buildHeaders() {
    const token = await resolveIdentityToken();
    const headers = {
        Accept: 'application/json',
    };
    if (token.startsWith('repl ') || token.startsWith('depl ')) {
        headers['X-Replit-Token'] = token;
    }
    else {
        headers['Replit-Authentication'] = `Bearer ${token}`;
    }
    return headers;
}
//# sourceMappingURL=identity.js.map