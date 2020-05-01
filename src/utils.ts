/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { assign, cloneDeep, each, filter, keys, map } from 'lodash';
import { js2xml, xml2js } from 'xml-js';
import {
  XmlNodeTypes,
  XmlTreeDeclaration,
  XmlTreeElement,
  XmlTreeRoot,
} from './components/types';

export type AnyObject = { [key: string]: unknown; [key: number]: unknown };

export interface NVP {
  name: string;
  value: unknown;
}

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
  obj: AnyObject,
  key = 'key',
  value = 'value',
  options?: KVPOptions,
): AnyObject[] {
  const opts = assign({}, kvpDefaultOptions, options);
  return filter(
    map(keys(obj), k => ({ [key]: k, [value]: obj[k] })),
    p => opts.keepUndefined || p[value] !== undefined,
  );
}

/**
 * Converts key-value pair array to object.
 * @param array
 * @param key
 * @param value
 * @param options
 */
export function kvpObject(
  array: AnyObject[],
  key = 'key',
  value = 'value',
  options?: KVPOptions,
): AnyObject {
  const opts = assign({}, kvpDefaultOptions, options);
  const obj = {} as AnyObject;
  each(array, a => {
    if (opts.keepUndefined || a[value] !== undefined) {
      obj[a[key] as string | number] = a[value];
    }
  });
  return obj;
}

/**
 * Deep clones the given `obj`, `except` specific 1st-level keys.
 * @param obj object to be cloned.
 * @param except keys in this array will be erased from the clone.
 */
export function cloneObject(
  obj: AnyObject,
  except?: string[] | number[],
): object {
  const shallow = Object.assign({}, obj);
  if (except) {
    each(except, k => delete shallow[k as string | number]);
  }
  return cloneDeep(shallow);
}

export function xmlJs(
  xml: string,
): XmlTreeRoot | XmlTreeDeclaration | XmlNodeTypes {
  return xml2js(xml, {
    addParent: true,
    elementsKey: 'nodes',
    attributesFn: (attrs: string | AnyObject) => {
      if ('string' == typeof attrs) {
        throw new Error(`Expected object, but got string '${attrs}'`);
      }
      return (kvpArray(attrs, 'name') as unknown) as NVP[];
    },
  }) as XmlTreeRoot | XmlTreeDeclaration | XmlNodeTypes;
}

export function objXml(obj: object): string {
  return js2xml(obj, {
    spaces: 2,
    elementsKey: 'nodes',
    attributesFn: (attrs: string | AnyObject[]) => {
      if ('string' == typeof attrs) {
        throw new Error(`Expected array, but got string '${attrs}'`);
      }
      return kvpObject(attrs, 'name');
    },
  });
}

/**
 * Clone the given node, without `parent` and `nodes`.
 * @param node
 */
export function cloneWithoutHierarchy(
  node: XmlNodeTypes | XmlTreeDeclaration,
): XmlNodeTypes | XmlTreeDeclaration {
  return cloneObject((node as unknown) as { [key: string]: unknown }, [
    'parent',
    'nodes',
  ]) as XmlNodeTypes | XmlTreeDeclaration;
}

/**
 * Makes sure there is no hierarchy data. This function mutates the given
 * `node`.
 */
export function removeHierarchyFromNode(
  node: XmlNodeTypes | XmlTreeDeclaration,
): void {
  delete node.parent;
  delete (node as XmlTreeElement).nodes;
}
