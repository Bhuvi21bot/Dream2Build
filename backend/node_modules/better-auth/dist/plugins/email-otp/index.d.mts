import { EmailOTPOptions } from "./types.mjs";
import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$_better_auth_core_db0 from "@better-auth/core/db";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";
import * as _$better_call0 from "better-call";
import * as _$zod from "zod";
import * as _$zod_v4_core0 from "zod/v4/core";

//#region src/plugins/email-otp/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "email-otp": {
      creator: typeof emailOTP;
    };
  }
}
declare const emailOTP: (options: EmailOTPOptions) => {
  id: "email-otp";
  version: string;
  init(ctx: _$_better_auth_core0.AuthContext): {
    options: {
      emailVerification: {
        sendVerificationEmail(data: {
          user: _$_better_auth_core_db0.User;
          url: string;
          token: string;
        }, request: Request | undefined): Promise<void>;
      };
    };
  } | undefined;
  endpoints: {
    sendVerificationOTP: _$better_call0.StrictEndpoint<"/email-otp/send-verification-otp", {
      method: "POST";
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>[];
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        type: _$zod.ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    createVerificationOTP: _$better_call0.StrictEndpoint<string, {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        type: _$zod.ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "string";
                  };
                };
              };
            };
          };
        };
      };
    }, string>;
    getVerificationOTP: _$better_call0.StrictEndpoint<string, {
      method: "GET";
      query: _$zod.ZodObject<{
        email: _$zod.ZodString;
        type: _$zod.ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      otp: {
                        type: string;
                        nullable: boolean;
                        description: string;
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
      otp: null;
    } | {
      otp: string;
    }>;
    checkVerificationOTP: _$better_call0.StrictEndpoint<"/email-otp/check-verification-otp", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        type: _$zod.ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
        otp: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    verifyEmailOTP: _$better_call0.StrictEndpoint<"/email-otp/verify-email", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        otp: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
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
                      status: {
                        type: string;
                        description: string;
                        enum: boolean[];
                      };
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        $ref: string;
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
      status: boolean;
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | {
      status: boolean;
      token: null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    }>;
    signInEmailOTP: _$better_call0.StrictEndpoint<"/sign-in/email-otp", {
      method: "POST";
      body: _$zod.ZodIntersection<_$zod.ZodObject<{
        email: _$zod.ZodString;
        otp: _$zod.ZodString;
        name: _$zod.ZodOptional<_$zod.ZodString>;
        image: _$zod.ZodOptional<_$zod.ZodString>;
      }, _$zod_v4_core0.$strip>, _$zod.ZodRecord<_$zod.ZodString, _$zod.ZodAny>>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        description: string;
                      };
                      user: {
                        $ref: string;
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
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    requestPasswordResetEmailOTP: _$better_call0.StrictEndpoint<"/email-otp/request-password-reset", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                        description: string;
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
      success: boolean;
    }>;
    forgetPasswordEmailOTP: _$better_call0.StrictEndpoint<"/forget-password/email-otp", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                        description: string;
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
      success: boolean;
    }>;
    resetPasswordEmailOTP: _$better_call0.StrictEndpoint<"/email-otp/reset-password", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        otp: _$zod.ZodString;
        password: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    requestEmailChangeEmailOTP: _$better_call0.StrictEndpoint<"/email-otp/request-email-change", {
      method: "POST";
      body: _$zod.ZodObject<{
        newEmail: _$zod.ZodString;
        otp: _$zod.ZodOptional<_$zod.ZodString>;
      }, _$zod_v4_core0.$strip>;
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
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    changeEmailEmailOTP: _$better_call0.StrictEndpoint<"/email-otp/change-email", {
      method: "POST";
      body: _$zod.ZodObject<{
        newEmail: _$zod.ZodString;
        otp: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
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
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
  };
  hooks: {
    after: {
      matcher(context: _$_better_auth_core0.HookEndpointContext): boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<void>>;
    }[];
  };
  rateLimit: ({
    pathMatcher(path: string): path is "/email-otp/send-verification-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/check-verification-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/verify-email";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/sign-in/email-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/request-password-reset";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/reset-password";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/forget-password/email-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/request-email-change";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/change-email";
    window: number;
    max: number;
  })[];
  options: EmailOTPOptions;
  $ERROR_CODES: {
    OTP_EXPIRED: _$_better_auth_core_utils_error_codes0.RawError<"OTP_EXPIRED">;
    INVALID_OTP: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: _$_better_auth_core_utils_error_codes0.RawError<"TOO_MANY_ATTEMPTS">;
  };
};
//#endregion
export { type EmailOTPOptions, emailOTP };