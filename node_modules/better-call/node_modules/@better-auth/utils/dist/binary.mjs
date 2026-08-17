//#region src/binary.ts
const decoders = /* @__PURE__ */ new Map();
const encoder = new TextEncoder();
const binary = {
	decode: (data, encoding = "utf-8") => {
		if (!decoders.has(encoding)) decoders.set(encoding, new TextDecoder(encoding));
		return decoders.get(encoding).decode(data);
	},
	encode: (input) => encoder.encode(input)
};
//#endregion
export { binary };
