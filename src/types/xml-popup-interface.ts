/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SaveNodeKeyboardEvent, SaveNodeMouseEvent } from './types';

export default interface G8XmlPopupInterface {
  save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void;
}
