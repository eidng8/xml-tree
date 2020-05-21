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

export interface XmlNodeBase {
  type: string;
  parent: XmlElement | XmlRoot;
}

export interface XmlCData extends XmlNodeBase {
  type: 'cdata';
  cdata: string;
}

export interface XmlComment extends XmlNodeBase {
  type: 'comment';
  comment: string;
}

export interface XmlDocType extends XmlNodeBase {
  type: 'doctype';
  doctype: string;
}

export interface XmlElement extends XmlNodeBase {
  type: 'element';
  name: string;
  attributes?: XmlAttribute[];
  nodes?: XmlNodeBase[];
}

export interface XmlInstruction extends XmlNodeBase {
  type: 'instruction';
  name: string;
  instruction?: string;
  attributes?: XmlAttribute[];
}

export interface XmlText extends XmlNodeBase {
  type: 'text';
  text: string;
}

export interface XmlRoot {
  declaration: XmlDeclaration;
  nodes?: XmlNodeBase[];
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
