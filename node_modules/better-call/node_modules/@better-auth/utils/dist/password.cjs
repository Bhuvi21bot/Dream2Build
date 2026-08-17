Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_hex = require("./hex.cjs");
let _noble_hashes_scrypt_js = require("@noble/hashes/scrypt.js");
//#region src/password.ts
const config = {
	N: 16384,
	r: 16,
	p: 1,
	dkLen: 64
};
async function generateKey(password, salt) {
	return (0, _noble_hashes_scrypt_js.scryptAsync)(password.normalize("NFKC"), salt, {
		N: config.N,
		r: config.r,
		p: config.p,
		dkLen: config.dkLen,
		maxmem: 128 * config.N * config.r * 2
	});
}
async function hashPassword(password) {
	const salt = require_hex.hex.encode(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)));
	const key = await generateKey(password, salt);
	return `${salt}:${require_hex.hex.encode(key)}`;
}
async function verifyPassword(hash, password) {
	const [salt, key] = hash.split(":");
	if (!salt || !key) throw new Error("Invalid password hash");
	const targetKey = await generateKey(password, salt);
	return require_hex.hex.encode(targetKey) === key;
}
//#endregion
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
