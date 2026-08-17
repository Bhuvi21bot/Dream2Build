Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_index = require("./index.cjs");
const require_bytes = require("./bytes.cjs");
const require_base64 = require("./base64.cjs");
//#region src/hash.ts
function createHash(algorithm, encoding) {
	return { digest: async (input) => {
		const data = require_bytes.toBufferSource(input);
		const hashBuffer = await require_index.getWebcryptoSubtle().digest(algorithm, data);
		if (encoding === "hex") return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
		if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") {
			if (encoding.includes("url")) return require_base64.base64Url.encode(hashBuffer, { padding: encoding !== "base64urlnopad" });
			return require_base64.base64.encode(hashBuffer);
		}
		return hashBuffer;
	} };
}
//#endregion
exports.createHash = createHash;
