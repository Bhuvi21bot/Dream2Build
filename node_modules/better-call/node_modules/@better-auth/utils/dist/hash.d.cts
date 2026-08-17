import { EncodingFormat, SHAFamily, TypedArray } from "./type.cjs";
//#region src/hash.d.ts
declare function createHash<Encoding extends EncodingFormat = "none">(algorithm: SHAFamily, encoding?: Encoding): {
  digest: (input: string | ArrayBuffer | TypedArray) => Promise<Encoding extends "none" ? ArrayBuffer : string>;
};
//#endregion
export { createHash };