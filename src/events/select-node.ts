/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SelectNodeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * A node has been selected. The `detail` field holds information about the
 * selected node. This event is not cancelable.
 */
export default class SelectNodeEvent extends EventBase<SelectNodeEventDetail> {
  static readonly TYPE = 'select-node';

  constructor(init?: CustomEventInit<SelectNodeEventDetail>) {
    super(SelectNodeEvent.TYPE, Object.assign({}, init, { cancelable: false }));
  }
}
