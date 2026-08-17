import { emailOTP } from "./index.mjs";
import { EMAIL_OTP_ERROR_CODES } from "./error-codes.mjs";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/email-otp/client.d.ts
declare const emailOTPClient: () => {
  id: "email-otp";
  version: string;
  $InferServerPlugin: ReturnType<typeof emailOTP>;
  atomListeners: {
    matcher: (path: string) => path is "/email-otp/verify-email" | "/sign-in/email-otp" | "/email-otp/request-email-change";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    OTP_EXPIRED: _$_better_auth_core_utils_error_codes0.RawError<"OTP_EXPIRED">;
    INVALID_OTP: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: _$_better_auth_core_utils_error_codes0.RawError<"TOO_MANY_ATTEMPTS">;
  };
};
//#endregion
export { emailOTPClient };