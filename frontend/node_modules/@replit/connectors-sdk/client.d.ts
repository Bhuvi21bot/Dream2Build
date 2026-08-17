import type { CliConfig, Connection, ListConnectionsOptions, ProxyOptions, ReplitConnectorsOptions } from './types';
export declare class ReplitConnectors {
    private readonly baseUrl;
    constructor(options?: ReplitConnectorsOptions);
    proxy(connectorName: string, path: string, options?: ProxyOptions): Promise<Response>;
    listConnections(options?: ListConnectionsOptions): Promise<Connection[]>;
    getProxyUrl(): string;
    getProxyHeaders(connectorName: string): Promise<Record<string, string>>;
    getCliConfig(connectorName: string): Promise<CliConfig>;
    createProxyFetch(connectorName: string): typeof fetch;
}
//# sourceMappingURL=client.d.ts.map