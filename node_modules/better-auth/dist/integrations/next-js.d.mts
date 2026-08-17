import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$better_call0 from "better-call";

//#region src/integrations/next-js.d.ts
declare function toNextJsHandler(auth: {
  handler: (request: Request) => Promise<Response>;
} | ((request: Request) => Promise<Response>)): {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
  PATCH: (request: Request) => Promise<Response>;
  PUT: (request: Request) => Promise<Response>;
  DELETE: (request: Request) => Promise<Response>;
};
declare const nextCookies: () => {
  id: "next-cookies";
  version: string;
  hooks: {
    before: {
      matcher(ctx: _$_better_auth_core0.HookEndpointContext): boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
    after: {
      matcher(ctx: _$_better_auth_core0.HookEndpointContext): true;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
  };
};
//#endregion
export { nextCookies, toNextJsHandler };