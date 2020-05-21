/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditNodeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * A node is about to be saved. The `detail` field holds information about the
 * node to be saved.
 */
export default class SaveNodeEvent extends EventBase<EditNodeEventDetail> {
  static readonly TYPE = 'save-node';

  constructor(init?: CustomEventInit<EditNodeEventDetail>) {
    super(SaveNodeEvent.TYPE, init);
  }
}
