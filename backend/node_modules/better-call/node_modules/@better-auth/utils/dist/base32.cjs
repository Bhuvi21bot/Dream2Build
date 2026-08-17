Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_bytes = require("./bytes.cjs");
//#region src/base32.ts
/**
* Returns the Base32 alphabet based on the encoding type.
* @param hex - Whether to use the hexadecimal Base32 alphabet.
* @returns The appropriate Base32 alphabet.
*/
function getAlphabet(hex) {
	return hex ? "0123456789ABCDEFGHIJKLMNOPQRSTUV" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
}
/**
* Creates a decode map for the given alphabet.
* @param alphabet - The Base32 alphabet.
* @returns A map of characters to their corresponding values.
*/
function createDecodeMap(alphabet) {
	const decodeMap = /* @__PURE__ */ new Map();
	for (let i = 0; i < alphabet.length; i++) decodeMap.set(alphabet[i], i);
	return decodeMap;
}
/**
* Encodes a Uint8Array into a Base32 string.
* @param data - The data to encode.
* @param alphabet - The Base32 alphabet to use.
* @param padding - Whether to include padding.
* @returns The Base32 encoded string.
*/
function base32Encode(data, alphabet, padding) {
	let result = "";
	let buffer = 0;
	let shift = 0;
	for (const byte of data) {
		buffer = buffer << 8 | byte;
		shift += 8;
		while (shift >= 5) {
			shift -= 5;
			result += alphabet[buffer >> shift & 31];
		}
	}
	if (shift > 0) result += alphabet[buffer << 5 - shift & 31];
	if (padding) {
		const padCount = (8 - result.length % 8) % 8;
		result += "=".repeat(padCount);
	}
	return result;
}
/**
* Decodes a Base32 string into a Uint8Array.
* @param data - The Base32 encoded string.
* @param alphabet - The Base32 alphabet to use.
* @returns The decoded Uint8Array.
*/
function base32Decode(data, alphabet) {
	const decodeMap = createDecodeMap(alphabet);
	const result = [];
	let buffer = 0;
	let bitsCollected = 0;
	for (const char of data) {
		if (char === "=") break;
		const value = decodeMap.get(char);
		if (value === void 0) throw new Error(`Invalid Base32 character: ${char}`);
		buffer = buffer << 5 | value;
		bitsCollected += 5;
		while (bitsCollected >= 8) {
			bitsCollected -= 8;
			result.push(buffer >> bitsCollected & 255);
		}
	}
	return Uint8Array.from(result);
}
/**
* Base32 encoding and decoding utility.
*/
const base32 = {
	/**
	* Encodes data into a Base32 string.
	* @param data - The data to encode (ArrayBuffer, number-based TypedArray, or string).
	* @param options - Encoding options.
	* @returns The Base32 encoded string.
	*/
	encode(data, options = {}) {
		const alphabet = getAlphabet(false);
		return base32Encode(require_bytes.toUint8Array(data), alphabet, options.padding ?? true);
	},
	/**
	* Decodes a Base32 string into a Uint8Array.
	* @param data - The Base32 encoded string or ArrayBuffer/TypedArray.
	* @returns The decoded Uint8Array.
	*/
	decode(data) {
		if (typeof data !== "string") data = new TextDecoder().decode(data);
		const alphabet = getAlphabet(false);
		return base32Decode(data, alphabet);
	}
};
/**
* Base32hex encoding and decoding utility.
*/
const base32hex = {
	/**
	* Encodes data into a Base32hex string.
	* @param data - The data to encode (ArrayBuffer, number-based TypedArray, or string).
	* @param options - Encoding options.
	* @returns The Base32hex encoded string.
	*/
	encode(data, options = {}) {
		const alphabet = getAlphabet(true);
		return base32Encode(require_bytes.toUint8Array(data), alphabet, options.padding ?? true);
	},
	/**
	* Decodes a Base32hex string into a Uint8Array.
	* @param data - The Base32hex encoded string.
	* @returns The decoded Uint8Array.
	*/
	decode(data) {
		return base32Decode(data, getAlphabet(true));
	}
};
//#endregion
exports.base32 = base32;
exports.base32hex = base32hex;
