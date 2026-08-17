import { NumberTypedArray, TypedArray, Uint8Array_ } from "./type.cjs";
//#region src/hex.d.ts
declare const hex: {
  encode: (data: string | ArrayBuffer | NumberTypedArray) => string;
  decode: (data: string | ArrayBuffer | TypedArray) => string;
  toBytes: (data: string) => Uint8Array_;
};
//#endregion
export { hex };