/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { assign, cloneDeep, each, filter, keys, map } from 'lodash';
import { js2xml, Options, xml2js } from 'xml-js';
import {
  XmlAttribute,
  XmlDeclaration,
  XmlElement,
  XmlNode,
  XmlNodeTypes,
  XmlRoot,
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

/**
 * Converts XML string to object.
 * @param xml
 * @param options
 */
export function xmlJs(
  xml: string,
  options?: Options.XML2JS,
): XmlRoot | XmlDeclaration | XmlNode {
  const opts = Object.assign(
    {},
    {
      addParent: true,
      elementsKey: 'nodes',
      attributesFn: (attrs: string | AnyObject) => {
        if ('string' == typeof attrs) {
          throw new Error(`Expected object, but got string '${attrs}'`);
        }
        return (kvpArray(attrs, 'name') as unknown) as NVP[];
      },
    },
    options,
  );
  return xml2js(xml, opts) as XmlRoot | XmlDeclaration | XmlNode;
}

/**
 * Converts object to XML string
 * @param obj
 * @param options
 */
export function objXml(obj: object, options?: Options.JS2XML): string {
  const opts = Object.assign(
    {},
    {
      spaces: 2,
      elementsKey: 'nodes',
      attributesFn: (attrs: string | AnyObject[]) => {
        if ('string' == typeof attrs) {
          throw new Error(`Expected array, but got string '${attrs}'`);
        }
        return kvpObject(attrs, 'name');
      },
    },
    options,
  );
  return js2xml(obj, opts);
}

/**
 * Clone the given node, without `parent` and `nodes`.
 * @param node
 */
export function cloneWithoutHierarchy(
  node: XmlNode | XmlDeclaration,
): XmlNode | XmlDeclaration {
  return cloneObject((node as unknown) as { [key: string]: unknown }, [
    'parent',
    'nodes',
  ]) as XmlNode | XmlDeclaration;
}

/**
 * Makes sure there is no hierarchy data. This function mutates the given
 * `node`.
 */
export function removeHierarchyFromNode(node: XmlNode | XmlDeclaration): void {
  delete node.parent;
  delete (node as XmlElement).nodes;
}

/**
 * Removes any object that has no name.
 * @param node
 */
export function rectifyNodeAttributes(node: XmlNode | XmlDeclaration): void {
  node = node as XmlElement;
  if (!node.attributes) return;
  node.attributes = filter(node.attributes, n => n.name) as XmlAttribute[];
}

/**
 * Creates an empty XML node.
 * @param type
 * @param ia `true` if processing instruction should use attributes.
 */
export function createEmptyNode(type: XmlNodeTypes, ia = false): XmlNode {
  const node = { type } as XmlNode;
  if ('element' == type || 'instruction' == type) {
    (node as XmlElement).name = `new-${type}`;
    if (ia || 'element' == type) (node as XmlElement).attributes = [];
  } else {
    // eslint-disable-next-line
    (node as any)[type] = `new ${type}`;
  }
  return node;
}
