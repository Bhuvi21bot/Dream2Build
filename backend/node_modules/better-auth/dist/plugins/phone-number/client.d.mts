import { PhoneNumberOptions, UserWithPhoneNumber } from "./types.mjs";
import { phoneNumber } from "./index.mjs";
import { PHONE_NUMBER_ERROR_CODES } from "./error-codes.mjs";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/phone-number/client.d.ts
declare const phoneNumberClient: () => {
  id: "phoneNumber";
  version: string;
  $InferServerPlugin: ReturnType<typeof phoneNumber>;
  atomListeners: {
    matcher(path: string): path is "/phone-number/verify" | "/sign-in/phone-number" | "/phone-number/update";
    signal: "$sessionSignal";
  }[];
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
export { phoneNumberClient };