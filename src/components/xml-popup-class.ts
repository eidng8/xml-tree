/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Vue } from 'vue-property-decorator';
import { SaveNodeEvent, XmlTreeElement } from './types';

export default abstract class G8XmlPopupClass extends Vue {
  abstract node: XmlTreeElement;

  save(evt: SaveNodeEvent) {
    evt.data = this.node;
    /**
     * The node passed in the `data` field shall be saved.
     * @param {SaveNodeEvent} event
     */
    this.$emit('save', evt);
  }
}
