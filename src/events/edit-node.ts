/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditNodeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * A node is about to be edited. The `detail` field holds information about the
 * node to be edited.
 */
export default class EditNodeEvent extends EventBase<EditNodeEventDetail> {
  static readonly TYPE = 'edit-node';

  constructor(init?: CustomEventInit<EditNodeEventDetail>) {
    super(EditNodeEvent.TYPE, init);
  }
}
