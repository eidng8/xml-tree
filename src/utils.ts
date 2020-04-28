export interface KVPOptions {
  keepUndefined: boolean;
}

const kvpDefaultOptions: KVPOptions = {
  keepUndefined: false,
};

/**
 * Converts object to key-value pair array.
 * @param obj
 * @param key
 * @param value
 * @param options
 */
export function kvpArray(
  obj: { [key: string]: unknown; [key: number]: unknown },
  key = 'key',
  value = 'value',
  options?: KVPOptions,
): { [key: string]: unknown }[] {
  options = Object.assign({}, kvpDefaultOptions, options);
  return Object.keys(obj)
    .map(name => ({
      [key]: name,
      [value]: obj[name],
    }))
    .filter(p => options!.keepUndefined || p[value] !== undefined);
}

/**
 * Converts key-value pair array to object.
 * @param array
 * @param key
 * @param value
 * @param options
 */
export function kvpObject(
  array: { [key: string]: unknown; [key: number]: unknown }[],
  key = 'key',
  value = 'value',
  options?: KVPOptions,
): { [key: string]: unknown; [key: number]: unknown } {
  options = Object.assign({}, kvpDefaultOptions, options);
  const obj = {} as { [key: string]: unknown; [key: number]: unknown };
  array.forEach(a => {
    if (options!.keepUndefined || a[value] !== undefined) {
      obj[a[key] as string | number] = a[value];
    }
  });
  return obj;
}

/**
 * Deep clones the given `obj`, `except` specific 1st-level keys.
 * @param obj
 * @param except
 */
export function clone(
  obj: { [key: string]: unknown; [key: number]: unknown },
  except?: string[],
): object {
  const clone = Object.assign({}, obj);
  if (except) {
    except.forEach(k => delete clone[k]);
  }
  return JSON.parse(JSON.stringify(clone));
}
