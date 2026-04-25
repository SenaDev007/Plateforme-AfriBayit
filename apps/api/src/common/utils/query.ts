type Compact<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/**
 * Removes undefined values and strips undefined from value types.
 * Required because exactOptionalPropertyTypes:true distinguishes
 * { key?: string } from { key: string | undefined }.
 */
export function compactQuery<T extends Record<string, unknown>>(obj: T): Compact<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Compact<T>;
}
