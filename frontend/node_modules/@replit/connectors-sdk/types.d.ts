export interface Connector {
    name: string;
    display_name?: string;
    logo_url?: string;
    stage?: string;
    platforms?: string[];
    auth_type?: string;
    description?: string;
    verticals?: string[];
    packages?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface Connection {
    id: string;
    connector_name: string;
    customer_id: string;
    status?: string;
    status_message?: string | null;
    created_at?: string;
    updated_at?: string;
    metadata?: Record<string, unknown> | null;
    connector?: Connector;
    integration?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface ReplitConnectorsOptions {
    baseUrl?: string;
}
export interface ProxyOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
}
export interface ListResponse<T> {
    items: T[];
    total?: number;
    limit?: number;
    offset?: number;
}
export interface ListConnectionsOptions {
    connector_names?: string;
    expand?: string[];
    refresh_policy?: 'none' | 'force' | 'auto';
}
export interface CliConfig {
    host: string;
    token: string;
    connectorName: string;
}
//# sourceMappingURL=types.d.ts.map