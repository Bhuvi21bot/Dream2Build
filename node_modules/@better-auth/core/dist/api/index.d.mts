import { BetterAuthDBSchema, ModelNames, SecondaryStorage } from "../db/type.mjs";
import { DBAdapter } from "../db/adapter/index.mjs";
import { createLogger } from "../env/logger.mjs";
import { AuthContext } from "../types/context.mjs";
import { OAuthProvider } from "../oauth2/oauth-provider.mjs";
import * as _$better_call0 from "better-call";
import { EndpointHandler, EndpointOptions, MiddlewareHandler, StrictEndpoint } from "better-call";
import * as _$_better_auth_core0 from "@better-auth/core";

//#region src/api/index.d.ts
declare const optionsMiddleware: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, <InputCtx extends _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>>(inputContext: InputCtx) => Promise<AuthContext>>;
declare const createAuthMiddleware: {
  <Options extends _$better_call0.MiddlewareOptions, R>(options: Options, handler: (ctx: _$better_call0.MiddlewareContext<Options, _$_better_auth_core0.PluginContext<_$_better_auth_core0.BetterAuthOptions> & _$_better_auth_core0.InfoContext & {
    options: _$_better_auth_core0.BetterAuthOptions;
    trustedOrigins: string[];
    trustedProviders: string[];
    isTrustedOrigin: (url: string, settings?: {
      allowRelativePaths: boolean;
    }) => boolean;
    oauthConfig: {
      skipStateCookieCheck?: boolean | undefined;
      storeStateStrategy: "database" | "cookie";
    };
    newSession: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null;
    session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null;
    setNewSession: (session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null) => void;
    socialProviders: OAuthProvider[];
    authCookies: _$_better_auth_core0.BetterAuthCookies;
    logger: ReturnType<typeof createLogger>;
    rateLimit: {
      enabled: boolean;
      window: number;
      max: number;
      storage: "memory" | "database" | "secondary-storage";
    } & Omit<_$_better_auth_core0.BetterAuthRateLimitOptions, "enabled" | "window" | "max" | "storage">;
    adapter: DBAdapter<_$_better_auth_core0.BetterAuthOptions>;
    internalAdapter: _$_better_auth_core0.InternalAdapter<_$_better_auth_core0.BetterAuthOptions>;
    createAuthCookie: (cookieName: string, overrideAttributes?: Partial<_$better_call0.CookieOptions> | undefined) => _$_better_auth_core0.BetterAuthCookie;
    secret: string;
    secretConfig: string | _$_better_auth_core0.SecretConfig;
    sessionConfig: {
      updateAge: number;
      expiresIn: number;
      freshAge: number;
      cookieRefreshCache: false | {
        enabled: true;
        updateAge: number;
      };
    };
    generateId: (options: {
      model: ModelNames;
      size?: number | undefined;
    }) => string | false;
    secondaryStorage: SecondaryStorage | undefined;
    password: {
      hash: (password: string) => Promise<string>;
      verify: (data: {
        password: string;
        hash: string;
      }) => Promise<boolean>;
      config: {
        minPasswordLength: number;
        maxPasswordLength: number;
      };
      checkPassword: (userId: string, ctx: _$_better_auth_core0.GenericEndpointContext<_$_better_auth_core0.BetterAuthOptions>) => Promise<boolean>;
    };
    tables: BetterAuthDBSchema;
    runMigrations: () => Promise<void>;
    publishTelemetry: (event: {
      type: string;
      anonymousId?: string | undefined;
      payload: Record<string, any>;
    }) => Promise<void>;
    skipOriginCheck: boolean | string[];
    skipCSRFCheck: boolean;
    runInBackground: (promise: Promise<unknown>) => void;
    runInBackgroundOrAwait: (promise: Promise<unknown> | void) => _$_better_auth_core0.Awaitable<unknown>;
  } & {
    returned?: unknown | undefined;
    responseHeaders?: Headers | undefined;
  }>) => Promise<R>): _$better_call0.Middleware<Options, (inputContext: _$better_call0.MiddlewareInputContext<Options>) => Promise<R>>;
  <Options extends _$better_call0.MiddlewareOptions, R_1>(handler: (ctx: _$better_call0.MiddlewareContext<Options, _$_better_auth_core0.PluginContext<_$_better_auth_core0.BetterAuthOptions> & _$_better_auth_core0.InfoContext & {
    options: _$_better_auth_core0.BetterAuthOptions;
    trustedOrigins: string[];
    trustedProviders: string[];
    isTrustedOrigin: (url: string, settings?: {
      allowRelativePaths: boolean;
    }) => boolean;
    oauthConfig: {
      skipStateCookieCheck?: boolean | undefined;
      storeStateStrategy: "database" | "cookie";
    };
    newSession: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null;
    session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null;
    setNewSession: (session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & Record<string, any>;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | null) => void;
    socialProviders: OAuthProvider[];
    authCookies: _$_better_auth_core0.BetterAuthCookies;
    logger: ReturnType<typeof createLogger>;
    rateLimit: {
      enabled: boolean;
      window: number;
      max: number;
      storage: "memory" | "database" | "secondary-storage";
    } & Omit<_$_better_auth_core0.BetterAuthRateLimitOptions, "enabled" | "window" | "max" | "storage">;
    adapter: DBAdapter<_$_better_auth_core0.BetterAuthOptions>;
    internalAdapter: _$_better_auth_core0.InternalAdapter<_$_better_auth_core0.BetterAuthOptions>;
    createAuthCookie: (cookieName: string, overrideAttributes?: Partial<_$better_call0.CookieOptions> | undefined) => _$_better_auth_core0.BetterAuthCookie;
    secret: string;
    secretConfig: string | _$_better_auth_core0.SecretConfig;
    sessionConfig: {
      updateAge: number;
      expiresIn: number;
      freshAge: number;
      cookieRefreshCache: false | {
        enabled: true;
        updateAge: number;
      };
    };
    generateId: (options: {
      model: ModelNames;
      size?: number | undefined;
    }) => string | false;
    secondaryStorage: SecondaryStorage | undefined;
    password: {
      hash: (password: string) => Promise<string>;
      verify: (data: {
        password: string;
        hash: string;
      }) => Promise<boolean>;
      config: {
        minPasswordLength: number;
        maxPasswordLength: number;
      };
      checkPassword: (userId: string, ctx: _$_better_auth_core0.GenericEndpointContext<_$_better_auth_core0.BetterAuthOptions>) => Promise<boolean>;
    };
    tables: BetterAuthDBSchema;
    runMigrations: () => Promise<void>;
    publishTelemetry: (event: {
      type: string;
      anonymousId?: string | undefined;
      payload: Record<string, any>;
    }) => Promise<void>;
    skipOriginCheck: boolean | string[];
    skipCSRFCheck: boolean;
    runInBackground: (promise: Promise<unknown>) => void;
    runInBackgroundOrAwait: (promise: Promise<unknown> | void) => _$_better_auth_core0.Awaitable<unknown>;
  } & {
    returned?: unknown | undefined;
    responseHeaders?: Headers | undefined;
  }>) => Promise<R_1>): _$better_call0.Middleware<Options, (inputContext: _$better_call0.MiddlewareInputContext<Options>) => Promise<R_1>>;
};
type AuthEndpointHandler<Path extends string, Options extends EndpointOptions, R> = EndpointHandler<Path, Options, R, AuthContext>;
type PathlessAuthEndpointHandler<Options extends EndpointOptions, R> = AuthEndpointHandler<string, Options, R>;
declare function createAuthEndpoint<Path extends string, Options extends EndpointOptions, R>(path: Path, options: Options, handler: AuthEndpointHandler<Path, Options, R>): StrictEndpoint<Path, Options, R>;
declare function createAuthEndpoint<InferredPath extends string, Options extends EndpointOptions, R>(options: Options, handler: PathlessAuthEndpointHandler<Options, R>): StrictEndpoint<InferredPath, Options, R>;
declare namespace createAuthEndpoint {
  var serverOnly: <InferredPath extends string, Options extends EndpointOptions, R>(options: Options, handler: PathlessAuthEndpointHandler<Options, R>) => StrictEndpoint<InferredPath, Options, R>;
}
type AuthEndpoint<Path extends string, Opts extends EndpointOptions, R> = ReturnType<typeof createAuthEndpoint<Path, Opts, R>>;
type AuthMiddleware = MiddlewareHandler;
//#endregion
export { AuthEndpoint, AuthMiddleware, createAuthEndpoint, createAuthMiddleware, optionsMiddleware };