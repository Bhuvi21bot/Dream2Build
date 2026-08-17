import { AnonymousOptions, AnonymousSession, UserWithAnonymous } from "./types.mjs";
import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";
import * as _$better_call0 from "better-call";

//#region src/plugins/anonymous/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    anonymous: {
      creator: typeof anonymous;
    };
  }
}
declare const anonymous: (options?: AnonymousOptions | undefined) => {
  id: "anonymous";
  version: string;
  endpoints: {
    signInAnonymous: _$better_call0.StrictEndpoint<"/sign-in/anonymous", {
      method: "POST";
      metadata: {
        openapi: {
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        $ref: string;
                      };
                      session: {
                        $ref: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      token: string;
      user: Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    deleteAnonymousUser: _$better_call0.StrictEndpoint<"/delete-anonymous-user", {
      method: "POST";
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          session: Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
          user: Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
            "400": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      message: {
                        type: string;
                      };
                    };
                  };
                  required: string[];
                };
              };
            };
            "500": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      message: {
                        type: string;
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
          };
        };
      };
    }, {
      success: boolean;
    }>;
  };
  hooks: {
    after: {
      matcher(ctx: _$_better_auth_core0.HookEndpointContext): boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
  };
  options: AnonymousOptions | undefined;
  schema: {
    user: {
      fields: {
        isAnonymous: {
          type: "boolean";
          required: false;
          input: false;
          defaultValue: false;
        };
      };
    };
  };
  $ERROR_CODES: {
    FAILED_TO_CREATE_USER: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_CREATE_USER">;
    INVALID_EMAIL_FORMAT: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_EMAIL_FORMAT">;
    COULD_NOT_CREATE_SESSION: _$_better_auth_core_utils_error_codes0.RawError<"COULD_NOT_CREATE_SESSION">;
    ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: _$_better_auth_core_utils_error_codes0.RawError<"ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY">;
    FAILED_TO_DELETE_ANONYMOUS_USER: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_DELETE_ANONYMOUS_USER">;
    FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS">;
    USER_IS_NOT_ANONYMOUS: _$_better_auth_core_utils_error_codes0.RawError<"USER_IS_NOT_ANONYMOUS">;
    DELETE_ANONYMOUS_USER_DISABLED: _$_better_auth_core_utils_error_codes0.RawError<"DELETE_ANONYMOUS_USER_DISABLED">;
  };
};
//#endregion
export { AnonymousOptions, AnonymousSession, UserWithAnonymous, anonymous };