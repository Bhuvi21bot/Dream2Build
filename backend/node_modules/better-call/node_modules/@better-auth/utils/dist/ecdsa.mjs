import { getWebcryptoSubtle } from "./index.mjs";
import { toBufferSource } from "./bytes.mjs";
//#region src/ecdsa.ts
const ecdsa = {
	generateKeyPair: async (curve = "P-256") => {
		const subtle = getWebcryptoSubtle();
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
		return await getWebcryptoSubtle().importKey("pkcs8", toBufferSource(privateKey), {
			name: "ECDSA",
			namedCurve: curve
		}, extractable, ["sign"]);
	},
	importPublicKey: async (publicKey, curve, extractable = false) => {
		return await getWebcryptoSubtle().importKey("spki", toBufferSource(publicKey), {
			name: "ECDSA",
			namedCurve: curve
		}, extractable, ["verify"]);
	},
	sign: async (privateKey, data, hash = "SHA-256") => {
		return await getWebcryptoSubtle().sign({
			name: "ECDSA",
			hash: { name: hash }
		}, privateKey, toBufferSource(data));
	},
	verify: async (publicKey, { signature, data, hash = "SHA-256" }) => {
		return await getWebcryptoSubtle().verify({
			name: "ECDSA",
			hash: { name: hash }
		}, publicKey, toBufferSource(signature), toBufferSource(data));
	},
	exportKey: async (key, format) => {
		return await getWebcryptoSubtle().exportKey(format, key);
	}
};
//#endregion
export { ecdsa };
