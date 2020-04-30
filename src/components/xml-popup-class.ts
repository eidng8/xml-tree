/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Vue } from 'vue-property-decorator';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlTreeElement,
} from './types';
import { removeHierarchyFromNode } from '../utils';

export default abstract class G8XmlPopupClass extends Vue {
  abstract node: XmlTreeElement;

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
