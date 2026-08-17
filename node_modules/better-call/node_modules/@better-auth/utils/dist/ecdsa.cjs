Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_index = require("./index.cjs");
const require_bytes = require("./bytes.cjs");
//#region src/ecdsa.ts
const ecdsa = {
	generateKeyPair: async (curve = "P-256") => {
		const subtle = require_index.getWebcryptoSubtle();
		const keyPair = await subtle.generateKey({
			name: "ECDSA",
			namedCurve: curve
		}, true, ["sign", "verify"]);
		return {
			privateKey: await subtle.exportKey("pkcs8", keyPair.privateKey),
			publicKey: await subtle.exportKey("spki", keyPair.publicKey)
		};
	},
	importPrivateKey: async (privateKey, curve, extractable = false) => {
		return await require_index.getWebcryptoSubtle().importKey("pkcs8", require_bytes.toBufferSource(privateKey), {
			name: "ECDSA",
			namedCurve: curve
		}, extractable, ["sign"]);
	},
	importPublicKey: async (publicKey, curve, extractable = false) => {
		return await require_index.getWebcryptoSubtle().importKey("spki", require_bytes.toBufferSource(publicKey), {
			name: "ECDSA",
			namedCurve: curve
		}, extractable, ["verify"]);
	},
	sign: async (privateKey, data, hash = "SHA-256") => {
		return await require_index.getWebcryptoSubtle().sign({
			name: "ECDSA",
			hash: { name: hash }
		}, privateKey, require_bytes.toBufferSource(data));
	},
	verify: async (publicKey, { signature, data, hash = "SHA-256" }) => {
		return await require_index.getWebcryptoSubtle().verify({
			name: "ECDSA",
			hash: { name: hash }
		}, publicKey, require_bytes.toBufferSource(signature), require_bytes.toBufferSource(data));
	},
	exportKey: async (key, format) => {
		return await require_index.getWebcryptoSubtle().exportKey(format, key);
	}
};
//#endregion
exports.ecdsa = ecdsa;
