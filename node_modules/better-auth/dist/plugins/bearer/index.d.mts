import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$better_call0 from "better-call";

//#region src/plugins/bearer/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    bearer: {
      creator: typeof bearer;
    };
  }
}
interface BearerOptions {
  /**
   * If true, only signed tokens
   * will be converted to session
   * cookies
   *
   * @default false
   */
  requireSignature?: boolean | undefined;
}
/**
 * Converts bearer token to session cookie
 */
declare const bearer: (options?: BearerOptions | undefined) => {
  id: "bearer";
  version: string;
  hooks: {
    before: {
      matcher(context: _$_better_auth_core0.HookEndpointContext): boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        context: {
          headers: Headers;
        };
      } | undefined>>;
    }[];
    after: {
      matcher(context: _$_better_auth_core0.HookEndpointContext): true;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
  };
  options: BearerOptions | undefined;
};
//#endregion
export { BearerOptions, bearer };