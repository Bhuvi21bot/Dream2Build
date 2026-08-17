import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/anonymous/error-codes.d.ts
declare const ANONYMOUS_ERROR_CODES: {
  FAILED_TO_CREATE_USER: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_CREATE_USER">;
  INVALID_EMAIL_FORMAT: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_EMAIL_FORMAT">;
  COULD_NOT_CREATE_SESSION: _$_better_auth_core_utils_error_codes0.RawError<"COULD_NOT_CREATE_SESSION">;
  ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: _$_better_auth_core_utils_error_codes0.RawError<"ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY">;
  FAILED_TO_DELETE_ANONYMOUS_USER: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_DELETE_ANONYMOUS_USER">;
  FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS: _$_better_auth_core_utils_error_codes0.RawError<"FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS">;
  USER_IS_NOT_ANONYMOUS: _$_better_auth_core_utils_error_codes0.RawError<"USER_IS_NOT_ANONYMOUS">;
  DELETE_ANONYMOUS_USER_DISABLED: _$_better_auth_core_utils_error_codes0.RawError<"DELETE_ANONYMOUS_USER_DISABLED">;
};
//#endregion
export { ANONYMOUS_ERROR_CODES };