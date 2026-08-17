import { getWebcryptoSubtle } from "./index.mjs";
import { toBufferSource } from "./bytes.mjs";
import { base64, base64Url } from "./base64.mjs";
//#region src/hash.ts
function createHash(algorithm, encoding) {
	return { digest: async (input) => {
		const data = toBufferSource(input);
		const hashBuffer = await getWebcryptoSubtle().digest(algorithm, data);
		if (encoding === "hex") return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
		if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") {
			if (encoding.includes("url")) return base64Url.encode(hashBuffer, { padding: encoding !== "base64urlnopad" });
			return base64.encode(hashBuffer);
		}
		return hashBuffer;
	} };
}
//#endregion
export { createHash };
