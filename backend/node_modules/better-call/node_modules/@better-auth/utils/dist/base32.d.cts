import { NumberTypedArray, TypedArray, Uint8Array_ } from "./type.cjs";
//#region src/base32.d.ts
/**
 * Base32 encoding and decoding utility.
 */
declare const base32: {
  /**
   * Encodes data into a Base32 string.
   * @param data - The data to encode (ArrayBuffer, number-based TypedArray, or string).
   * @param options - Encoding options.
   * @returns The Base32 encoded string.
   */
  encode(data: ArrayBuffer | NumberTypedArray | string, options?: {
    padding?: boolean;
  }): string;
  /**
   * Decodes a Base32 string into a Uint8Array.
   * @param data - The Base32 encoded string or ArrayBuffer/TypedArray.
   * @returns The decoded Uint8Array.
   */
  decode(data: string | ArrayBuffer | TypedArray): Uint8Array_;
};
/**
 * Base32hex encoding and decoding utility.
 */
declare const base32hex: {
  /**
   * Encodes data into a Base32hex string.
   * @param data - The data to encode (ArrayBuffer, number-based TypedArray, or string).
   * @param options - Encoding options.
   * @returns The Base32hex encoded string.
   */
  encode(data: ArrayBuffer | NumberTypedArray | string, options?: {
    padding?: boolean;
  }): string;
  /**
   * Decodes a Base32hex string into a Uint8Array.
   * @param data - The Base32hex encoded string.
   * @returns The decoded Uint8Array.
   */
  decode(data: string): Uint8Array_;
};
//#endregion
export { base32, base32hex };