/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface XmlAttribute {
  name: string;
  value: string | undefined;
}

export interface XmlDeclaration {
  attributes: XmlAttribute[];
  parent: XmlRoot;
}

export interface XmlEntry {
  type: string;
  parent: XmlElement | XmlRoot;
}

export interface XmlCData extends XmlEntry {
  type: 'cdata';
  cdata: string;
}

export interface XmlComment extends XmlEntry {
  type: 'comment';
  comment: string;
}

export interface XmlDocType extends XmlEntry {
  type: 'doctype';
  doctype: string;
}

export interface XmlElement extends XmlEntry {
  type: 'element';
  name: string;
  attributes?: XmlAttribute[];
  nodes?: XmlEntry[];
}

export interface XmlInstruction extends XmlEntry {
  type: 'instruction';
  name: string;
  instruction?: string;
  attributes?: XmlAttribute[];
}

export interface XmlText extends XmlEntry {
  type: 'text';
  text: string;
}

export interface XmlRoot {
  declaration: XmlDeclaration;
  nodes?: XmlEntry[];
}

export type XmlNode =
  | XmlCData
  | XmlComment
  | XmlDocType
  | XmlElement
  | XmlInstruction
  | XmlText;

export type XmlNodeTypes =
  | 'cdata'
  | 'comment'
  | 'doctype'
  | 'element'
  | 'instruction'
  | 'text';

export class SaveNodeMouseEvent extends MouseEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNode | XmlDeclaration | XmlAttribute;
}

export class SaveNodeKeyboardEvent extends KeyboardEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNode | XmlDeclaration | XmlAttribute;
}

export function isDeclarationNode(
  node: XmlNode | XmlDeclaration,
): node is XmlDeclaration {
  return !(node as XmlNode).type;
}

export function defaultDeclaration(parent?: XmlRoot): XmlDeclaration {
  return {
    attributes: [
      { name: 'version', value: '1.0' },
      { name: 'encoding', value: 'utf-8' },
      { name: 'standalone', value: 'no' },
    ],
    parent: parent!,
  };
}
