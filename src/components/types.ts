/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface XmlAttribute {
  name: string;
  value: string | undefined;
}

export interface XmlEditDeclaration {
  attributes: XmlAttribute[];
  parent: XmlEditRoot;
}

export interface XmlEditEntry {
  type: string;
  parent: XmlEditElement | XmlEditRoot;
}

export interface XmlEditCData extends XmlEditEntry {
  type: 'cdata';
  cdata: string;
}

export interface XmlEditComment extends XmlEditEntry {
  type: 'comment';
  comment: string;
}

export interface XmlEditDocType extends XmlEditEntry {
  type: 'doctype';
  doctype: string;
}

export interface XmlEditElement extends XmlEditEntry {
  type: 'element';
  name: string;
  attributes?: XmlAttribute[];
  nodes?: XmlEditEntry[];
}

export interface XmlEditInstruction extends XmlEditEntry {
  type: 'instruction';
  name: string;
  instruction?: string;
  attributes?: XmlAttribute[];
}

export interface XmlEditText extends XmlEditEntry {
  type: 'text';
  text: string;
}

export interface XmlEditRoot {
  declaration: XmlEditDeclaration;
  nodes?: XmlEditEntry[];
}

export type XmlNodeTypes =
  | XmlEditCData
  | XmlEditComment
  | XmlEditDocType
  | XmlEditElement
  | XmlEditInstruction
  | XmlEditText;

export class SaveNodeMouseEvent extends MouseEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNodeTypes | XmlEditDeclaration | XmlAttribute;
}

export class SaveNodeKeyboardEvent extends KeyboardEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNodeTypes | XmlEditDeclaration | XmlAttribute;
}

export function isDeclarationNode(
  node: XmlNodeTypes | XmlEditDeclaration,
): node is XmlEditDeclaration {
  return !(node as XmlNodeTypes).type;
}

export function defaultDeclaration(parent?: XmlEditRoot): XmlEditDeclaration {
  return {
    attributes: [
      { name: 'version', value: '1.0' },
      { name: 'encoding', value: 'utf-8' },
      { name: 'standalone', value: 'no' },
    ],
    parent: parent!,
  };
}
