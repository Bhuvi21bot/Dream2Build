import { parseCookies } from "../../cookies/cookie-utils.mjs";
import { PACKAGE_VERSION } from "../../version.mjs";
//#region src/plugins/last-login-method/client.ts
function getCookieValue(name) {
	if (typeof document === "undefined") return null;
	return parseCookies(document.cookie).get(name) ?? null;
}
/**
* Client-side plugin to retrieve the last used login method
*/
const lastLoginMethodClient = (config = {}) => {
	const cookieName = config.cookieName || "better-auth.last_used_login_method";
	return {
		id: "last-login-method-client",
		version: PACKAGE_VERSION,
		getActions() {
			return {
				/**
				* Get the last used login method from cookies
				* @returns The last used login method or null if not found
				*/
				getLastUsedLoginMethod: () => {
					return getCookieValue(cookieName);
				},
				/**
				* Clear the last used login method cookie
				* This sets the cookie with an expiration date in the past
				*/
				clearLastUsedLoginMethod: () => {
					if (typeof document !== "undefined") {
						const domainPart = config.domain ? ` domain=${config.domain};` : "";
						document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domainPart}`;
					}
				},
				/**
				* Check if a specific login method was the last used
				* @param method The method to check
				* @returns True if the method was the last used, false otherwise
				*/
				isLastUsedLoginMethod: (method) => {
					return getCookieValue(cookieName) === method;
				}
			};
		}
	};
};
//#endregion
export { lastLoginMethodClient };
