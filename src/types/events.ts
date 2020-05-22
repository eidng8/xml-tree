/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { G8MenuItem } from 'g8-popup-menu';
import {
  XmlAttribute,
  XmlDeclaration,
  XmlElement,
  XmlInstruction,
  XmlNode,
  XmlRoot,
} from './types';

export interface DocumentDetail {
  /**
   * The object representation of XML document that has been loaded.
   */
  document: XmlRoot;
}

export interface NodeDetail {
  /**
   * The target node.
   */
  node: XmlNode | XmlDeclaration;

  /**
   * Parent node of the target.
   */
  parent: XmlElement | XmlRoot;

  /**
   * Index in parent's `nodes` (children) array.
   */
  index: number;

  /**
   * Whether the target node is being created (not yet added to DOM).
   */
  creating?: boolean;
}

export interface DefaultDeclarationEventDetail extends DocumentDetail {
  /**
   * The declaration object to be used for the XML document.
   */
  declaration: XmlDeclaration;
}

export interface SelectNodeEventDetail extends NodeDetail {
  /**
   * - `true` if the node is being expanded;
   * - `false` if the node is being collapsed;
   * - `undefined` if neither of above.
   */
  expanded?: boolean;
}

export interface EditNodeEventDetail extends DocumentDetail, NodeDetail {}

export interface EditAttributeEventDetail extends DocumentDetail {
  /**
   * The target node.
   */
  node: XmlElement | XmlInstruction;

  /**
   * The target attribute.
   */
  attribute: XmlAttribute;
}

export interface MenuOpenEventDetail {
  /**
   * Items to be presented in the menu.
   */
  items: G8MenuItem[];

  /**
   * The node that triggered the context menu.
   */
  node: XmlNode;

  /**
   * Whether `node` is at root level.
   */
  rootLevel: boolean;

  /**
   * The original event that triggered the menu.
   */
  originalEvent?: Event;
}

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
