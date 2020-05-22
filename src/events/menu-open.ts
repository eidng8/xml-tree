/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { MenuOpenEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * The context menu is about to open. Call `preventDefault()` to prevent menu
 * from opening. `detail.items` are items to be shown in the menu (return value
 * of the event).
 */
export default class MenuOpenEvent extends EventBase<MenuOpenEventDetail> {
  static readonly TYPE = 'menu-open';

  constructor(init?: CustomEventInit<MenuOpenEventDetail>) {
    super(MenuOpenEvent.TYPE, init);
  }
}
