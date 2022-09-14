/**
 * Convert a string or string array value to a string array
 */
export function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? (val as T[]) : [val as T];
}
