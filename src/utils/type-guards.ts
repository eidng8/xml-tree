/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  XmlCData,
  XmlComment,
  XmlDeclaration,
  XmlDocType,
  XmlElement,
  XmlInstruction,
  XmlNode,
  XmlText,
} from '../types/types';

export function isCDataNode(node: XmlNode): node is XmlCData {
  return 'cdata' == node.type;
}

export function isCommentNode(node: XmlNode): node is XmlComment {
  return 'comment' == node.type;
}

export function isDocTypeNode(node: XmlNode): node is XmlDocType {
  return 'doctype' == node.type;
}

export function isDeclarationNode(
  node: XmlNode | XmlDeclaration,
): node is XmlDeclaration {
  return !(node as XmlNode).type;
}

export function isElementNode(node: XmlNode): node is XmlElement {
  return 'element' == node.type;
}

export function isInstructionNode(node: XmlNode): node is XmlInstruction {
  return 'instruction' == node.type;
}

export function isTextNode(node: XmlNode): node is XmlText {
  return 'text' == node.type;
}
