import { toUint8Array } from "./bytes.mjs";
import { hexToBytes } from "@noble/hashes/utils.js";
//#region src/hex.ts
const toBytes = (data) => hexToBytes(data);
const hex = {
	encode: (data) => {
		const buffer = toUint8Array(data);
		if (buffer.byteLength === 0) return "";
		let result = "";
		for (const byte of buffer) result += byte.toString(16).padStart(2, "0");
		return result;
	},
	decode: (data) => {
		if (!data) return "";
		if (typeof data === "string") return new TextDecoder().decode(toBytes(data));
		return new TextDecoder().decode(data);
	},
	toBytes
};
//#endregion
export { hex };
