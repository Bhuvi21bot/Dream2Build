import { PhoneNumberOptions, UserWithPhoneNumber } from "./types.mjs";
import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";
import * as _$better_call0 from "better-call";
import * as _$zod from "zod";
import * as _$zod_v4_core0 from "zod/v4/core";

//#region src/plugins/phone-number/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "phone-number": {
      creator: typeof phoneNumber;
    };
  }
}
declare const phoneNumber: (options?: PhoneNumberOptions | undefined) => {
  id: "phone-number";
  version: string;
  init(): {
    options: {
      databaseHooks: {
        user: {
          update: {
            before(data: Partial<{
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            }> & Record<string, unknown>): Promise<{
              data: {
                [x: string]: unknown;
                id?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                name?: string | undefined;
                image?: string | null | undefined;
              };
            } | undefined>;
          };
        };
      };
    };
  };
  hooks: {
    before: {
      matcher: (ctx: _$_better_auth_core0.HookEndpointContext) => boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<never>>;
    }[];
  };
  endpoints: {
    signInPhoneNumber: _$better_call0.StrictEndpoint<"/sign-in/phone-number", {
      method: "POST";
      body: _$zod.ZodObject<{
        phoneNumber: _$zod.ZodString;
        password: _$zod.ZodString;
        rememberMe: _$zod.ZodOptional<_$zod.ZodBoolean>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          summary: string;
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
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      token: string;
      user: UserWithPhoneNumber;
    }>;
    sendPhoneNumberOTP: _$better_call0.StrictEndpoint<"/phone-number/send-otp", {
      method: "POST";
      body: _$zod.ZodObject<{
        phoneNumber: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          summary: string;
          description: string;
          responses: {
            200: {
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
                };
              };
            };
          };
        };
      };
    }, {
      message: string;
    }>;
    verifyPhoneNumber: _$better_call0.StrictEndpoint<"/phone-number/verify", {
      method: "POST";
      body: _$zod.ZodIntersection<_$zod.ZodObject<{
        phoneNumber: _$zod.ZodString;
        code: _$zod.ZodString;
        disableSession: _$zod.ZodOptional<_$zod.ZodBoolean>;
        updatePhoneNumber: _$zod.ZodOptional<_$zod.ZodBoolean>;
      }, _$zod_v4_core0.$strip>, _$zod.ZodRecord<_$zod.ZodString, _$zod.ZodAny>>;
      metadata: {
        openapi: {
          summary: string;
          description: string;
          responses: {
            "200": {
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
                        type: string;
                        nullable: boolean;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            nullable: boolean;
                            description: string;
                          };
                          name: {
                            type: string;
                            nullable: boolean;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          phoneNumber: {
                            type: string;
                            description: string;
                          };
                          phoneNumberVerified: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                        };
                        required: string[];
                        description: string;
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
            400: {
              description: string;
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
      } & UserWithPhoneNumber;
    } | {
      status: boolean;
      token: null;
      user: UserWithPhoneNumber;
    }>;
    requestPasswordResetPhoneNumber: _$better_call0.StrictEndpoint<"/phone-number/request-password-reset", {
      method: "POST";
      body: _$zod.ZodObject<{
        phoneNumber: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
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
    }>;
    resetPasswordPhoneNumber: _$better_call0.StrictEndpoint<"/phone-number/reset-password", {
      method: "POST";
      body: _$zod.ZodObject<{
        otp: _$zod.ZodString;
        phoneNumber: _$zod.ZodString;
        newPassword: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
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
    }>;
  };
  schema: {
    user: {
      fields: {
        phoneNumber: {
          type: "string";
          required: false;
          unique: true;
          sortable: true;
          returned: true;
        };
        phoneNumberVerified: {
          type: "boolean";
          required: false;
          returned: true;
          input: false;
        };
      };
    };
  };
  rateLimit: {
    pathMatcher(path: string): boolean;
    window: number;
    max: number;
  }[];
  options: PhoneNumberOptions | undefined;
  $ERROR_CODES: {
    OTP_EXPIRED: _$_better_auth_core_utils_error_codes0.RawError<"OTP_EXPIRED">;
    INVALID_OTP: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: _$_better_auth_core_utils_error_codes0.RawError<"TOO_MANY_ATTEMPTS">;
    INVALID_PHONE_NUMBER: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_PHONE_NUMBER">;
    PHONE_NUMBER_EXIST: _$_better_auth_core_utils_error_codes0.RawError<"PHONE_NUMBER_EXIST">;
    PHONE_NUMBER_NOT_EXIST: _$_better_auth_core_utils_error_codes0.RawError<"PHONE_NUMBER_NOT_EXIST">;
    INVALID_PHONE_NUMBER_OR_PASSWORD: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_PHONE_NUMBER_OR_PASSWORD">;
    UNEXPECTED_ERROR: _$_better_auth_core_utils_error_codes0.RawError<"UNEXPECTED_ERROR">;
    OTP_NOT_FOUND: _$_better_auth_core_utils_error_codes0.RawError<"OTP_NOT_FOUND">;
    PHONE_NUMBER_NOT_VERIFIED: _$_better_auth_core_utils_error_codes0.RawError<"PHONE_NUMBER_NOT_VERIFIED">;
    PHONE_NUMBER_CANNOT_BE_UPDATED: _$_better_auth_core_utils_error_codes0.RawError<"PHONE_NUMBER_CANNOT_BE_UPDATED">;
    SEND_OTP_NOT_IMPLEMENTED: _$_better_auth_core_utils_error_codes0.RawError<"SEND_OTP_NOT_IMPLEMENTED">;
  };
};
//#endregion
export { type PhoneNumberOptions, type UserWithPhoneNumber, phoneNumber };