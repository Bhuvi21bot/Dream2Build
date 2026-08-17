//#region src/bytes.ts
function toBufferSource(data) {
	if (typeof data === "string") return new TextEncoder().encode(data);
	if (!ArrayBuffer.isView(data)) return data;
	if (data.buffer instanceof ArrayBuffer) return data;
	return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice();
}
/**
* Converts strings and binary data into a `Uint8Array`.
*
* `ArrayBuffer` inputs share memory with the returned view, while number-based
* `TypedArray` inputs are copied according to native constructor semantics.
*
* @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#buffer | ArrayBuffer constructor behavior}
* @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray | TypedArray constructor behavior}
*/
function toUint8Array(data) {
	if (typeof data === "string") return new TextEncoder().encode(data);
	return new Uint8Array(data);
}
//#endregion
exports.toBufferSource = toBufferSource;
exports.toUint8Array = toUint8Array;
