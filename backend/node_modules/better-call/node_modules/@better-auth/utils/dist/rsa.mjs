import { getWebcryptoSubtle } from "./index.mjs";
import { toBufferSource } from "./bytes.mjs";
//#region src/rsa.ts
const rsa = {
	generateKeyPair: async (modulusLength = 2048, hash = "SHA-256") => {
		return await getWebcryptoSubtle().generateKey({
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
		return await getWebcryptoSubtle().exportKey(format, key);
	},
	importKey: async (key, usage = "encrypt", hash = "SHA-256") => {
		return await getWebcryptoSubtle().importKey("jwk", key, {
			name: "RSA-OAEP",
			hash: { name: hash }
		}, true, [usage]);
	},
	encrypt: async (key, data) => {
		return await getWebcryptoSubtle().encrypt({ name: "RSA-OAEP" }, key, toBufferSource(data));
	},
	decrypt: async (key, data) => {
		return await getWebcryptoSubtle().decrypt({ name: "RSA-OAEP" }, key, toBufferSource(data));
	},
	sign: async (key, data, saltLength = 32) => {
		return await getWebcryptoSubtle().sign({
			name: "RSA-PSS",
			saltLength
		}, key, toBufferSource(data));
	},
	verify: async (key, { signature, data, saltLength = 32 }) => {
		return await getWebcryptoSubtle().verify({
			name: "RSA-PSS",
			saltLength
		}, key, toBufferSource(signature), toBufferSource(data));
	}
};
//#endregion
export { rsa };
