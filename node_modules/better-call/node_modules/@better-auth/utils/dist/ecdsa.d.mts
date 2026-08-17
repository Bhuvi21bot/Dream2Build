import { ECDSACurve, ExportKeyFormat, SHAFamily, TypedArray } from "./type.mjs";
//#region src/ecdsa.d.ts
declare const ecdsa: {
  generateKeyPair: (curve?: ECDSACurve) => Promise<{
    privateKey: ArrayBuffer;
    publicKey: ArrayBuffer;
  }>;
  importPrivateKey: (privateKey: ArrayBuffer | TypedArray | string, curve: ECDSACurve, extractable?: boolean) => Promise<CryptoKey>;
  importPublicKey: (publicKey: ArrayBuffer | TypedArray | string, curve: ECDSACurve, extractable?: boolean) => Promise<CryptoKey>;
  sign: (privateKey: CryptoKey, data: ArrayBuffer | TypedArray | string, hash?: SHAFamily) => Promise<ArrayBuffer>;
  verify: (publicKey: CryptoKey, { signature, data, hash }: {
    signature: ArrayBuffer | TypedArray | string;
    data: ArrayBuffer | string;
    hash?: SHAFamily;
  }) => Promise<boolean>;
  exportKey: <E extends ExportKeyFormat>(key: CryptoKey, format: E) => Promise<E extends "jwk" ? JsonWebKey : ArrayBuffer>;
};
//#endregion
export { ecdsa };