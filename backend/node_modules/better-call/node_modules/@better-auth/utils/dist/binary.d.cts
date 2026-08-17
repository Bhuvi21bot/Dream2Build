import { Uint8Array_ } from "./type.cjs";
//#region src/binary.d.ts
type Encoding = "utf-8" | "utf-16" | "iso-8859-1";
type BinaryData = ArrayBuffer | ArrayBufferView;
declare const binary: {
  decode: (data: BinaryData, encoding?: Encoding) => string;
  encode: (input?: string) => Uint8Array_;
};
//#endregion
export { binary };