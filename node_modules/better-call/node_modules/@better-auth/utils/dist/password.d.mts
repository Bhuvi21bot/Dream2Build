//#region src/password.d.ts
declare function hashPassword(password: string): Promise<string>;
declare function verifyPassword(hash: string, password: string): Promise<boolean>;
//#endregion
export { hashPassword, verifyPassword };