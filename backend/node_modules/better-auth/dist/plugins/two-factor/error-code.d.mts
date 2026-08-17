import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/two-factor/error-code.d.ts
declare const TWO_FACTOR_ERROR_CODES: {
  OTP_NOT_ENABLED: _$_better_auth_core_utils_error_codes0.RawError<"OTP_NOT_ENABLED">;
  OTP_HAS_EXPIRED: _$_better_auth_core_utils_error_codes0.RawError<"OTP_HAS_EXPIRED">;
  TOTP_NOT_ENABLED: _$_better_auth_core_utils_error_codes0.RawError<"TOTP_NOT_ENABLED">;
  TWO_FACTOR_NOT_ENABLED: _$_better_auth_core_utils_error_codes0.RawError<"TWO_FACTOR_NOT_ENABLED">;
  BACKUP_CODES_NOT_ENABLED: _$_better_auth_core_utils_error_codes0.RawError<"BACKUP_CODES_NOT_ENABLED">;
  INVALID_BACKUP_CODE: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_BACKUP_CODE">;
  INVALID_CODE: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_CODE">;
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: _$_better_auth_core_utils_error_codes0.RawError<"TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE">;
  ACCOUNT_TEMPORARILY_LOCKED: _$_better_auth_core_utils_error_codes0.RawError<"ACCOUNT_TEMPORARILY_LOCKED">;
  INVALID_TWO_FACTOR_COOKIE: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_TWO_FACTOR_COOKIE">;
};
//#endregion
export { TWO_FACTOR_ERROR_CODES };