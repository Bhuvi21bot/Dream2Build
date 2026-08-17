import * as z from "zod";
//#region src/utils/email.ts
/**
* @see https://www.rfc-editor.org/rfc/rfc6761.html#section-6.4
*/
const PLACEHOLDER_EMAIL_DOMAIN = "placeholder.invalid";
/**
* Creates a stable, non-routable email address for an account without an email.
*
* @throws TypeError if the generated email is invalid.
*/
function createPlaceholderEmail({ identifier, namespace }) {
	const result = z.email().safeParse(`${identifier}@${namespace}.${PLACEHOLDER_EMAIL_DOMAIN}`);
	if (!result.success) throw new TypeError("Invalid placeholder email");
	return result.data;
}
//#endregion
export { createPlaceholderEmail };
