import { USERNAME_ERROR_CODES } from "./error-codes.mjs";
import { username } from "./index.mjs";
import * as _$_better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/username/client.d.ts
declare const usernameClient: () => {
  id: "username";
  version: string;
  $InferServerPlugin: ReturnType<typeof username>;
  atomListeners: {
    matcher: (path: string) => path is "/sign-in/username";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    EMAIL_NOT_VERIFIED: _$_better_auth_core_utils_error_codes0.RawError<"EMAIL_NOT_VERIFIED">;
    UNEXPECTED_ERROR: _$_better_auth_core_utils_error_codes0.RawError<"UNEXPECTED_ERROR">;
    INVALID_USERNAME_OR_PASSWORD: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_USERNAME_OR_PASSWORD">;
    USERNAME_IS_ALREADY_TAKEN: _$_better_auth_core_utils_error_codes0.RawError<"USERNAME_IS_ALREADY_TAKEN">;
    USERNAME_TOO_SHORT: _$_better_auth_core_utils_error_codes0.RawError<"USERNAME_TOO_SHORT">;
    USERNAME_TOO_LONG: _$_better_auth_core_utils_error_codes0.RawError<"USERNAME_TOO_LONG">;
    INVALID_USERNAME: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_USERNAME">;
    INVALID_DISPLAY_USERNAME: _$_better_auth_core_utils_error_codes0.RawError<"INVALID_DISPLAY_USERNAME">;
  };
};
//#endregion
export { usernameClient };