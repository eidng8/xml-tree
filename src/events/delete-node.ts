/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditNodeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * A node is about to be deleted. The `detail` field holds information about the
 * node to be deleted. This event has no return value.
 */
export default class DeleteNodeEvent extends EventBase<EditNodeEventDetail> {
  static readonly TYPE = 'delete-node';

  constructor(init?: CustomEventInit<EditNodeEventDetail>) {
    super(DeleteNodeEvent.TYPE, init);
  }
}
