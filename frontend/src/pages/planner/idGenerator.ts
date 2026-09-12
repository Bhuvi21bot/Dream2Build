/**
 * Secure ID Generator
 * Replaces weak Math.random() implementations.
 */

export const generateId = (prefix = ''): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return prefix + crypto.randomUUID();
  }
  // Fallback for older browsers (though crypto is widely supported)
  return prefix + 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
