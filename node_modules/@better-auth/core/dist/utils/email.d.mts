//#region src/utils/email.d.ts
interface PlaceholderEmailOptions {
  /**
   * A stable identifier that distinguishes the account within the namespace.
   */
  identifier: string;
  /**
   * A namespace that distinguishes identical identifiers from different sources.
   */
  namespace: string;
}
/**
 * Creates a stable, non-routable email address for an account without an email.
 *
 * @throws TypeError if the generated email is invalid.
 */
declare function createPlaceholderEmail({
  identifier,
  namespace
}: PlaceholderEmailOptions): string;
//#endregion
export { PlaceholderEmailOptions, createPlaceholderEmail };