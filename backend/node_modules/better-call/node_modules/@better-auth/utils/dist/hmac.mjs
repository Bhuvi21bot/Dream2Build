import { getWebcryptoSubtle } from "./index.mjs";
import { toBufferSource } from "./bytes.mjs";
import { base64, base64Url } from "./base64.mjs";
import { hex } from "./hex.mjs";
//#region src/hmac.ts
const createHMAC = (algorithm = "SHA-256", encoding = "none") => {
	const hmac = {
		importKey: async (key, keyUsage) => {
			return getWebcryptoSubtle().importKey("raw", toBufferSource(key), {
				name: "HMAC",
				hash: { name: algorithm }
			}, false, [keyUsage]);
		},
		sign: async (hmacKey, data) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "sign");
			const signature = await getWebcryptoSubtle().sign("HMAC", hmacKey, toBufferSource(data));
			if (encoding === "hex") return hex.encode(signature);
			if (encoding === "base64") return base64.encode(signature);
			if (encoding === "base64url" || encoding === "base64urlnopad") return base64Url.encode(signature, { padding: encoding !== "base64urlnopad" });
			return signature;
		},
		verify: async (hmacKey, data, signature) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "verify");
			if (encoding === "hex") signature = typeof signature === "string" ? hex.toBytes(signature) : signature;
			if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") signature = await base64.decode(signature);
			return getWebcryptoSubtle().verify("HMAC", hmacKey, toBufferSource(signature), toBufferSource(data));
		}
	};
	return hmac;
};
//#endregion
export { createHMAC };
