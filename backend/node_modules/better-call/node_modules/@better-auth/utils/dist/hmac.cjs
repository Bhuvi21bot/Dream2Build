Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_index = require("./index.cjs");
const require_bytes = require("./bytes.cjs");
const require_base64 = require("./base64.cjs");
const require_hex = require("./hex.cjs");
//#region src/hmac.ts
const createHMAC = (algorithm = "SHA-256", encoding = "none") => {
	const hmac = {
		importKey: async (key, keyUsage) => {
			return require_index.getWebcryptoSubtle().importKey("raw", require_bytes.toBufferSource(key), {
				name: "HMAC",
				hash: { name: algorithm }
			}, false, [keyUsage]);
		},
		sign: async (hmacKey, data) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "sign");
			const signature = await require_index.getWebcryptoSubtle().sign("HMAC", hmacKey, require_bytes.toBufferSource(data));
			if (encoding === "hex") return require_hex.hex.encode(signature);
			if (encoding === "base64") return require_base64.base64.encode(signature);
			if (encoding === "base64url" || encoding === "base64urlnopad") return require_base64.base64Url.encode(signature, { padding: encoding !== "base64urlnopad" });
			return signature;
		},
		verify: async (hmacKey, data, signature) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "verify");
			if (encoding === "hex") signature = typeof signature === "string" ? require_hex.hex.toBytes(signature) : signature;
			if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") signature = await require_base64.base64.decode(signature);
			return require_index.getWebcryptoSubtle().verify("HMAC", hmacKey, require_bytes.toBufferSource(signature), require_bytes.toBufferSource(data));
		}
	};
	return hmac;
};
//#endregion
exports.createHMAC = createHMAC;
