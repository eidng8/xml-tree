/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Component, Prop, Vue } from 'vue-property-decorator';
import { removeHierarchyFromNode } from '../utils';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlDeclaration,
  XmlNode,
} from '../types/types';
import { getTexts } from '../translations/translation';
import G8XmlPopupInterface from '../types/xml-popup-interface';

@Component
export default class PopupBoxMixin extends Vue implements G8XmlPopupInterface {
  @Prop() protected node!: XmlNode | XmlDeclaration;

  protected texts = getTexts();

  save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    evt.data = this.node;
    removeHierarchyFromNode(this.node);
    /**
     * The node passed in the `data` field shall be saved.
     * @param {SaveNodeMouseEvent|SaveNodeKeyboardEvent} event
     */
    this.$emit('save', evt);
  }
}
