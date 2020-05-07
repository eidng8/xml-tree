/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Vue } from 'vue-property-decorator';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlDeclaration,
  XmlNode,
} from './types';
import { removeHierarchyFromNode } from '../utils';
import { getTexts } from '../translations/translation';
import G8XmlPopupInterface from './xml-popup-interface';

export default abstract class G8XmlPopupClass extends Vue
  implements G8XmlPopupInterface {
  abstract node: XmlNode | XmlDeclaration;

  texts = getTexts();

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
