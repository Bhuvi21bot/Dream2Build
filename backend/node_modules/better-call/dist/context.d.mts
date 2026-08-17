import { CookieOptions, CookiePrefixOptions } from "./cookies.mjs";
import { StandardSchemaV1 } from "./standard-schema.mjs";
import { Status, statusCodes } from "./error.mjs";
import { IsEmptyObject, Prettify, UnionToIntersection } from "./helper.mjs";
import { MiddlewareHandler, MiddlewareOptions } from "./middleware.mjs";
import { EndpointOptions } from "./endpoint.mjs";
import { InferRouteParams } from "rou3";
//#region src/context.d.ts
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Method = HTTPMethod | "*";
type InferBodyInput<Options extends EndpointOptions | MiddlewareOptions, Body = Options["metadata"] extends {
  $Infer: {
    body: infer B;
  };
} ? B : Options["body"] extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Options["body"]> : undefined> = undefined extends Body ? {
  body?: Body;
} : {
  body: Body;
};
type InferBody<Options extends EndpointOptions | MiddlewareOptions> = Options["metadata"] extends {
  $Infer: {
    body: infer Body;
  };
} ? Body : Options["body"] extends StandardSchemaV1 ? StandardSchemaV1.InferOutput<Options["body"]> : any;
type InferQueryInput<Options extends EndpointOptions | MiddlewareOptions, Query = Options["metadata"] extends {
  $Infer: {
    query: infer Query;
  };
} ? Query : Options["query"] extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Options["query"]> : Record<string, any> | undefined> = undefined extends Query ? {
  query?: Query;
} : {
  query: Query;
};
type InferQuery<Options extends EndpointOptions | MiddlewareOptions> = Options["metadata"] extends {
  $Infer: {
    query: infer Query;
  };
} ? Query : Options["query"] extends StandardSchemaV1 ? StandardSchemaV1.InferOutput<Options["query"]> : Record<string, any> | undefined;
type InferMethod<Options extends EndpointOptions> = Options["method"] extends Array<Method> ? Options["method"][number] : Options["method"] extends "*" ? HTTPMethod : Options["method"];
type InferInputMethod<Options extends EndpointOptions, Method = Options["method"] extends Array<any> ? Options["method"][number] | undefined : Options["method"] extends "*" ? HTTPMethod : Options["method"] | undefined> = undefined extends Method ? {
  method?: Method;
} : {
  method: Method;
};
type TrailingWildcardKey<Path extends string> = Path extends `${infer Prefix}/*${"" | "/"}` ? Exclude<keyof InferRouteParams<Path>, keyof InferRouteParams<Prefix>> : never;
type RouteParams<Path extends string> = { [Key in keyof InferRouteParams<Path>]: Key extends TrailingWildcardKey<Path> ? InferRouteParams<Path>[Key] | undefined : InferRouteParams<Path>[Key]; };
type InferParam<Path extends string> = string extends Path ? Record<string, string | undefined> | undefined : [Path] extends [never] ? Record<string, string | undefined> | undefined : IsEmptyObject<RouteParams<Path>> extends true ? Record<string, string | undefined> | undefined : Prettify<RouteParams<Path>>;
type InferParamInput<Path extends string> = string extends Path ? {
  params?: Record<string, string | undefined>;
} : [Path] extends [never] ? {
  params?: Record<string, string | undefined>;
} : IsEmptyObject<RouteParams<Path>> extends true ? {
  params?: Record<string, string | undefined>;
} : {
  params: Prettify<RouteParams<Path>>;
};
type InferRequest<Option extends EndpointOptions | MiddlewareOptions> = Option["requireRequest"] extends true ? Request : Request | undefined;
type InferRequestInput<Option extends EndpointOptions | MiddlewareOptions> = Option["requireRequest"] extends true ? {
  request: Request;
} : {
  request?: Request;
};
type InferHeaders<Option extends EndpointOptions | MiddlewareOptions> = Option["requireHeaders"] extends true ? Headers : Headers | undefined;
type InferHeadersInput<Option extends EndpointOptions | MiddlewareOptions> = Option["requireHeaders"] extends true ? {
  headers: HeadersInit;
} : {
  headers?: HeadersInit;
};
type InferMiddlewareContext<T> = T extends ((...args: never[]) => infer Result) ? unknown extends Awaited<Result> ? never : Extract<Awaited<Result>, object> : never;
type InferMiddlewareContexts<Opts extends EndpointOptions["use"]> = Opts extends MiddlewareHandler[] ? InferMiddlewareContext<Opts[number]> : never;
type InferUse<Opts extends EndpointOptions["use"]> = [InferMiddlewareContexts<Opts>] extends [never] ? object : UnionToIntersection<InferMiddlewareContexts<Opts>>;
type InferMiddlewareBody<Options extends MiddlewareOptions> = Options["body"] extends StandardSchemaV1<infer T> ? T : any;
type InferMiddlewareQuery<Options extends MiddlewareOptions> = Options["query"] extends StandardSchemaV1<infer T> ? T : Record<string, any> | undefined;
type InputContext<Path extends string, Options extends EndpointOptions> = InferBodyInput<Options> & InferInputMethod<Options> & InferQueryInput<Options> & InferParamInput<Path> & InferRequestInput<Options> & InferHeadersInput<Options> & {
  asResponse?: boolean;
  returnHeaders?: boolean;
  returnStatus?: boolean;
  use?: MiddlewareHandler[];
  path?: string;
  context?: Record<string, any>;
};
declare const createInternalContext: (context: InputContext<any, any>, { options, path }: {
  options: EndpointOptions;
  path?: string;
}) => Promise<{
  body: any;
  query: any;
  path: string;
  context: Record<string, any>;
  returned: any;
  headers: HeadersInit | undefined;
  request: Request | undefined;
  params: Record<string, string | undefined> | undefined;
  method: any;
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string | null;
  getCookie: (key: string, prefix?: CookiePrefixOptions) => string | null;
  getSignedCookie: (key: string, secret: string, prefix?: CookiePrefixOptions) => Promise<string | false | null>;
  setCookie: (key: string, value: string, options?: CookieOptions) => string;
  setSignedCookie: (key: string, value: string, secret: string, options?: CookieOptions) => Promise<string>;
  redirect: (url: string) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  error: (status: keyof typeof statusCodes | Status, body?: {
    message?: string;
    code?: string;
  } | undefined, headers?: HeadersInit) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  setStatus: (status: Status) => void;
  json: (json: Record<string, any>, routerResponse?: {
    status?: number;
    headers?: Record<string, string>;
    response?: Response;
    body?: Record<string, any>;
  } | Response) => Record<string, any>;
  responseHeaders: Headers;
  responseStatus: Status | undefined;
  asResponse?: boolean;
  returnHeaders?: boolean;
  returnStatus?: boolean;
  use?: MiddlewareHandler[];
} | {
  body: any;
  query: any;
  path: string;
  context: Record<string, any>;
  returned: any;
  headers: HeadersInit | undefined;
  request: Request | undefined;
  params: Record<string, string | undefined> | undefined;
  method: any;
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string | null;
  getCookie: (key: string, prefix?: CookiePrefixOptions) => string | null;
  getSignedCookie: (key: string, secret: string, prefix?: CookiePrefixOptions) => Promise<string | false | null>;
  setCookie: (key: string, value: string, options?: CookieOptions) => string;
  setSignedCookie: (key: string, value: string, secret: string, options?: CookieOptions) => Promise<string>;
  redirect: (url: string) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  error: (status: keyof typeof statusCodes | Status, body?: {
    message?: string;
    code?: string;
  } | undefined, headers?: HeadersInit) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  setStatus: (status: Status) => void;
  json: (json: Record<string, any>, routerResponse?: {
    status?: number;
    headers?: Record<string, string>;
    response?: Response;
    body?: Record<string, any>;
  } | Response) => Record<string, any>;
  responseHeaders: Headers;
  responseStatus: Status | undefined;
  asResponse?: boolean;
  returnHeaders?: boolean;
  returnStatus?: boolean;
  use?: MiddlewareHandler[];
} | {
  body: any;
  query: any;
  path: string;
  context: Record<string, any>;
  returned: any;
  headers: HeadersInit | undefined;
  request: Request | undefined;
  params: Record<string, string | undefined> | undefined;
  method: any;
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string | null;
  getCookie: (key: string, prefix?: CookiePrefixOptions) => string | null;
  getSignedCookie: (key: string, secret: string, prefix?: CookiePrefixOptions) => Promise<string | false | null>;
  setCookie: (key: string, value: string, options?: CookieOptions) => string;
  setSignedCookie: (key: string, value: string, secret: string, options?: CookieOptions) => Promise<string>;
  redirect: (url: string) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  error: (status: keyof typeof statusCodes | Status, body?: {
    message?: string;
    code?: string;
  } | undefined, headers?: HeadersInit) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  setStatus: (status: Status) => void;
  json: (json: Record<string, any>, routerResponse?: {
    status?: number;
    headers?: Record<string, string>;
    response?: Response;
    body?: Record<string, any>;
  } | Response) => Record<string, any>;
  responseHeaders: Headers;
  responseStatus: Status | undefined;
  asResponse?: boolean;
  returnHeaders?: boolean;
  returnStatus?: boolean;
  use?: MiddlewareHandler[];
} | {
  body: any;
  query: any;
  path: string;
  context: Record<string, any>;
  returned: any;
  headers: HeadersInit | undefined;
  request: Request | undefined;
  params: Record<string, string | undefined> | undefined;
  method: any;
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string | null;
  getCookie: (key: string, prefix?: CookiePrefixOptions) => string | null;
  getSignedCookie: (key: string, secret: string, prefix?: CookiePrefixOptions) => Promise<string | false | null>;
  setCookie: (key: string, value: string, options?: CookieOptions) => string;
  setSignedCookie: (key: string, value: string, secret: string, options?: CookieOptions) => Promise<string>;
  redirect: (url: string) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  error: (status: keyof typeof statusCodes | Status, body?: {
    message?: string;
    code?: string;
  } | undefined, headers?: HeadersInit) => {
    status: keyof typeof statusCodes | Status;
    body: ({
      message?: string;
      code?: string;
      cause?: unknown;
    } & Record<string, any>) | undefined;
    headers: HeadersInit;
    statusCode: number;
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  } & {
    errorStack: string | undefined;
  };
  setStatus: (status: Status) => void;
  json: (json: Record<string, any>, routerResponse?: {
    status?: number;
    headers?: Record<string, string>;
    response?: Response;
    body?: Record<string, any>;
  } | Response) => Record<string, any>;
  responseHeaders: Headers;
  responseStatus: Status | undefined;
  asResponse?: boolean;
  returnHeaders?: boolean;
  returnStatus?: boolean;
  use?: MiddlewareHandler[];
}>;
//#endregion
export { HTTPMethod, InferBody, InferBodyInput, InferHeaders, InferHeadersInput, InferInputMethod, InferMethod, InferMiddlewareBody, InferMiddlewareQuery, InferParam, InferParamInput, InferQuery, InferQueryInput, InferRequest, InferRequestInput, InferUse, InputContext, Method, createInternalContext };
//# sourceMappingURL=context.d.mts.map