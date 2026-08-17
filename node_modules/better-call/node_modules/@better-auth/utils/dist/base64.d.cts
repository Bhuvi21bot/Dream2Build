import { NumberTypedArray, TypedArray } from "./type.cjs";
//#region src/base64.d.ts
declare const base64: {
  encode(data: ArrayBuffer | NumberTypedArray | string, options?: {
    padding?: boolean;
  }): string;
  decode(data: string | ArrayBuffer | TypedArray): Uint8Array<ArrayBuffer>;
};
declare const base64Url: {
  encode(data: ArrayBuffer | NumberTypedArray | string, options?: {
    padding?: boolean;
  }): string;
  decode(data: string): Uint8Array<ArrayBuffer>;
};
//#endregion
export { base64, base64Url };