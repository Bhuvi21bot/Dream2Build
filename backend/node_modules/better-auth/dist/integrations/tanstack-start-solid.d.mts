import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$better_call0 from "better-call";

//#region src/integrations/tanstack-start-solid.d.ts
/**
 * TanStack Start cookie plugin for Solid.js.
 *
 * This plugin automatically handles cookie setting for TanStack Start with Solid.js.
 * It uses `@tanstack/solid-start-server` to set cookies.
 *
 * For React, use `better-auth/tanstack-start` instead.
 *
 * @example
 * ```ts
 * import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
 *
 * const auth = betterAuth({
 *   plugins: [tanstackStartCookies()],
 * });
 * ```
 */
declare const tanstackStartCookies: () => {
  id: "tanstack-start-cookies-solid";
  version: string;
  hooks: {
    after: {
      matcher(ctx: _$_better_auth_core0.HookEndpointContext): true;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
  };
};
//#endregion
export { tanstackStartCookies };