/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface XmlAttribute {
  name: string;
  value: string | undefined;
}

export interface XmlTreeDeclaration {
  attributes: XmlAttribute[];
  parent: XmlTreeRoot;
}

export interface XmlTreeEntry {
  type: string;
  parent: XmlTreeElement | XmlTreeRoot;
}

export interface XmlTreeCData extends XmlTreeEntry {
  type: 'cdata';
  cdata: string;
}

export interface XmlTreeComment extends XmlTreeEntry {
  type: 'comment';
  comment: string;
}

export interface XmlTreeDocType extends XmlTreeEntry {
  type: 'doctype';
  doctype: string;
}

export interface XmlTreeElement extends XmlTreeEntry {
  type: 'element';
  name: string;
  attributes?: XmlAttribute[];
  nodes?: XmlTreeEntry[];
}

export interface XmlTreeInstruction extends XmlTreeEntry {
  type: 'instruction';
  name: string;
  instruction?: string;
  attributes?: XmlAttribute[];
}

export interface XmlTreeText extends XmlTreeEntry {
  type: 'text';
  text: string;
}

export interface XmlTreeRoot {
  declaration: XmlTreeDeclaration;
  nodes?: XmlTreeEntry[];
}

export type XmlNodeTypes =
  | XmlTreeCData
  | XmlTreeComment
  | XmlTreeDocType
  | XmlTreeElement
  | XmlTreeInstruction
  | XmlTreeText;

export class SaveNodeMouseEvent extends MouseEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNodeTypes | XmlTreeDeclaration;
}

export class SaveNodeKeyboardEvent extends KeyboardEvent {
  /**
   * This node will not have `parent` or `nodes`.
   */
  data!: XmlNodeTypes | XmlTreeDeclaration;
}

export function isDeclarationNode(
  node: XmlNodeTypes | XmlTreeDeclaration,
): node is XmlTreeDeclaration {
  return !(node as XmlNodeTypes).type;
}
