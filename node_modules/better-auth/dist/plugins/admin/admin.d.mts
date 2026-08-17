import { AccessControl, ArrayElement, Statements } from "../access/types.mjs";
import { AdminOptions, InferAdminRolesFromOption, SessionWithImpersonatedBy, UserWithRole } from "./types.mjs";
import * as _$_better_auth_core0 from "@better-auth/core";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";
import * as _$better_call0 from "better-call";
import * as _$zod from "zod";
import * as _$zod_v4_core0 from "zod/v4/core";

//#region src/plugins/admin/admin.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    admin: {
      creator: typeof admin;
    };
  }
}
declare const admin: <O extends AdminOptions>(options?: O | undefined) => {
  id: "admin";
  version: string;
  init(): {
    options: {
      databaseHooks: {
        user: {
          create: {
            before(user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & Record<string, unknown>): Promise<{
              data: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
                role: string;
              };
            }>;
          };
        };
        session: {
          create: {
            before(session: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              userId: string;
              expiresAt: Date;
              token: string;
              ipAddress?: string | null | undefined;
              userAgent?: string | null | undefined;
            } & Record<string, unknown>, ctx: _$_better_auth_core0.GenericEndpointContext | null): Promise<void>;
          };
        };
      };
    };
  };
  hooks: {
    after: {
      matcher(context: _$_better_auth_core0.HookEndpointContext): boolean;
      handler: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<SessionWithImpersonatedBy[] | undefined>>;
    }[];
  };
  endpoints: {
    setRole: _$better_call0.StrictEndpoint<"/admin/set-role", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
        role: _$zod.ZodUnion<readonly [_$zod.ZodString, _$zod.ZodArray<_$zod.ZodString>]>;
      }, _$zod_v4_core0.$strip>;
      requireHeaders: true;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
        $Infer: {
          body: {
            userId: string;
            role: InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>> | InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>>[];
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    getUser: _$better_call0.StrictEndpoint<"/admin/get-user", {
      method: "GET";
      query: _$zod.ZodObject<{
        id: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, UserWithRole>;
    createUser: _$better_call0.StrictEndpoint<"/admin/create-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        email: _$zod.ZodString;
        password: _$zod.ZodOptional<_$zod.ZodString>;
        name: _$zod.ZodString;
        role: _$zod.ZodOptional<_$zod.ZodUnion<readonly [_$zod.ZodString, _$zod.ZodArray<_$zod.ZodString>]>>;
        data: _$zod.ZodOptional<_$zod.ZodRecord<_$zod.ZodString, _$zod.ZodAny>>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
        $Infer: {
          body: {
            email: string;
            password?: string | undefined;
            name: string;
            role?: InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>> | InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>>[] | undefined;
            data?: Record<string, any> | undefined;
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    adminUpdateUser: _$better_call0.StrictEndpoint<"/admin/update-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
        data: _$zod.ZodRecord<_$zod.ZodAny, _$zod.ZodAny>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, UserWithRole>;
    listUsers: _$better_call0.StrictEndpoint<"/admin/list-users", {
      method: "GET";
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      query: _$zod.ZodObject<{
        searchValue: _$zod.ZodOptional<_$zod.ZodString>;
        searchField: _$zod.ZodOptional<_$zod.ZodEnum<{
          email: "email";
          name: "name";
        }>>;
        searchOperator: _$zod.ZodOptional<_$zod.ZodEnum<{
          contains: "contains";
          starts_with: "starts_with";
          ends_with: "ends_with";
        }>>;
        limit: _$zod.ZodOptional<_$zod.ZodUnion<[_$zod.ZodString, _$zod.ZodNumber]>>;
        offset: _$zod.ZodOptional<_$zod.ZodUnion<[_$zod.ZodString, _$zod.ZodNumber]>>;
        sortBy: _$zod.ZodOptional<_$zod.ZodString>;
        sortDirection: _$zod.ZodOptional<_$zod.ZodEnum<{
          asc: "asc";
          desc: "desc";
        }>>;
        filterField: _$zod.ZodOptional<_$zod.ZodString>;
        filterValue: _$zod.ZodOptional<_$zod.ZodUnion<[_$zod.ZodUnion<[_$zod.ZodUnion<[_$zod.ZodUnion<[_$zod.ZodString, _$zod.ZodNumber]>, _$zod.ZodBoolean]>, _$zod.ZodArray<_$zod.ZodString>]>, _$zod.ZodArray<_$zod.ZodNumber>]>>;
        filterOperator: _$zod.ZodOptional<_$zod.ZodEnum<{
          eq: "eq";
          ne: "ne";
          gt: "gt";
          gte: "gte";
          lt: "lt";
          lte: "lte";
          in: "in";
          not_in: "not_in";
          contains: "contains";
          starts_with: "starts_with";
          ends_with: "ends_with";
        }>>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                      users: {
                        type: string;
                        items: {
                          $ref: string;
                        };
                      };
                      total: {
                        type: string;
                      };
                      limit: {
                        type: string;
                      };
                      offset: {
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
      users: UserWithRole[];
      total: number;
    }>;
    listUserSessions: _$better_call0.StrictEndpoint<"/admin/list-user-sessions", {
      method: "POST";
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                      sessions: {
                        type: string;
                        items: {
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
      };
    }, {
      sessions: SessionWithImpersonatedBy[];
    }>;
    unbanUser: _$better_call0.StrictEndpoint<"/admin/unban-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    banUser: _$better_call0.StrictEndpoint<"/admin/ban-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
        banReason: _$zod.ZodOptional<_$zod.ZodString>;
        banExpiresIn: _$zod.ZodOptional<_$zod.ZodNumber>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    impersonateUser: _$better_call0.StrictEndpoint<"/admin/impersonate-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                      session: {
                        $ref: string;
                      };
                      user: {
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
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      };
      user: UserWithRole;
    }>;
    stopImpersonating: _$better_call0.StrictEndpoint<"/admin/stop-impersonating", {
      method: "POST";
      requireHeaders: true;
    }, {
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
    }>;
    revokeUserSession: _$better_call0.StrictEndpoint<"/admin/revoke-user-session", {
      method: "POST";
      body: _$zod.ZodObject<{
        sessionToken: _$zod.ZodString;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
    revokeUserSessions: _$better_call0.StrictEndpoint<"/admin/revoke-user-sessions", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
    removeUser: _$better_call0.StrictEndpoint<"/admin/remove-user", {
      method: "POST";
      body: _$zod.ZodObject<{
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
    setUserPassword: _$better_call0.StrictEndpoint<"/admin/set-user-password", {
      method: "POST";
      body: _$zod.ZodObject<{
        newPassword: _$zod.ZodString;
        userId: _$zod.ZodCoercedString<unknown>;
      }, _$zod_v4_core0.$strip>;
      use: _$better_call0.Middleware<_$better_call0.MiddlewareOptions, (inputContext: _$better_call0.MiddlewareInputContext<_$better_call0.MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
          session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
        };
      }>>[];
      metadata: {
        openapi: {
          operationId: string;
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
                      status: {
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
      status: boolean;
    }>;
    userHasPermission: _$better_call0.StrictEndpoint<"/admin/has-permission", {
      method: "POST";
      body: _$zod.ZodIntersection<_$zod.ZodObject<{
        userId: _$zod.ZodOptional<_$zod.ZodCoercedString<unknown>>;
        role: _$zod.ZodOptional<_$zod.ZodString>;
      }, _$zod_v4_core0.$strip>, _$zod.ZodXor<readonly [_$zod.ZodObject<{
        permission: _$zod.ZodRecord<_$zod.ZodString, _$zod.ZodArray<_$zod.ZodString>>;
      }, _$zod_v4_core0.$strip>, _$zod.ZodObject<{
        permissions: _$zod.ZodRecord<_$zod.ZodString, _$zod.ZodArray<_$zod.ZodString>>;
      }, _$zod_v4_core0.$strip>]>>;
      metadata: {
        openapi: {
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    permissions: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      error: {
                        type: string;
                      };
                      success: {
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
        $Infer: {
          body: {
            permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })[key] extends readonly unknown[] ? ArrayElement<(O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })[key]> : never)[] | undefined };
          } & {
            userId?: string | undefined;
            role?: InferAdminRolesFromOption<O> | undefined;
          };
        };
      };
    }, {
      error: null;
      success: boolean;
    }>;
  };
  $ERROR_CODES: {
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: _$_better_auth_core_utils_error_codes0.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
    FAILED_TO_CREATE_USER: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_CREATE_USER">;
    USER_ALREADY_EXISTS: _$_better_auth_core_utils_error_codes0.RawError<"USER_ALREADY_EXISTS">;
    YOU_CANNOT_BAN_YOURSELF: _$_better_auth_core_utils_error_codes0.RawError<"YOU_CANNOT_BAN_YOURSELF">;
    YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
    YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
    YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
    YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
    BANNED_USER: _$_better_auth_core_utils_error_codes0.RawError<"BANNED_USER">;
    YOU_ARE_NOT_ALLOWED_TO_GET_USER: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
    NO_DATA_TO_UPDATE: _$_better_auth_core_utils_error_codes0.RawError<"NO_DATA_TO_UPDATE">;
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
    YOU_CANNOT_REMOVE_YOURSELF: _$_better_auth_core_utils_error_codes0.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
    YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
    YOU_CANNOT_IMPERSONATE_ADMINS: _$_better_auth_core_utils_error_codes0.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
    INVALID_ROLE_TYPE: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_ROLE_TYPE">;
    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: _$_better_auth_core_utils_error_codes0.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
    PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: _$_better_auth_core_utils_error_codes0.RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
  };
  schema: {
    user: {
      fields: {
        role: {
          type: "string";
          required: false;
          input: false;
        };
        banned: {
          type: "boolean";
          defaultValue: false;
          required: false;
          input: false;
        };
        banReason: {
          type: "string";
          required: false;
          input: false;
        };
        banExpires: {
          type: "date";
          required: false;
          input: false;
        };
      };
    };
    session: {
      fields: {
        impersonatedBy: {
          type: "string";
          required: false;
          input: false;
        };
      };
    };
  };
  options: NoInfer<O>;
};
//#endregion
export { admin };