Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_index = require("./index.cjs");
const require_bytes = require("./bytes.cjs");
//#region src/rsa.ts
const rsa = {
	generateKeyPair: async (modulusLength = 2048, hash = "SHA-256") => {
		return await require_index.getWebcryptoSubtle().generateKey({
			name: "RSA-OAEP",
			modulusLength,
			publicExponent: new Uint8Array([
				1,
				0,
				1
			]),
			hash: { name: hash }
		}, true, ["encrypt", "decrypt"]);
	},
	exportKey: async (key, format) => {
		return await require_index.getWebcryptoSubtle().exportKey(format, key);
	},
	importKey: async (key, usage = "encrypt", hash = "SHA-256") => {
		return await require_index.getWebcryptoSubtle().importKey("jwk", key, {
			name: "RSA-OAEP",
			hash: { name: hash }
		}, true, [usage]);
	},
	encrypt: async (key, data) => {
		return await require_index.getWebcryptoSubtle().encrypt({ name: "RSA-OAEP" }, key, require_bytes.toBufferSource(data));
	},
	decrypt: async (key, data) => {
		return await require_index.getWebcryptoSubtle().decrypt({ name: "RSA-OAEP" }, key, require_bytes.toBufferSource(data));
	},
	sign: async (key, data, saltLength = 32) => {
		return await require_index.getWebcryptoSubtle().sign({
			name: "RSA-PSS",
			saltLength
		}, key, require_bytes.toBufferSource(data));
	},
	verify: async (key, { signature, data, saltLength = 32 }) => {
		return await require_index.getWebcryptoSubtle().verify({
			name: "RSA-PSS",
			saltLength
		}, key, require_bytes.toBufferSource(signature), require_bytes.toBufferSource(data));
	}
};
//#endregion
exports.rsa = rsa;
