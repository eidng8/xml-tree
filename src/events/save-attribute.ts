/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditAttributeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * An attribute is about to be saved. The `detail` field holds information
 * about the attribute to be saved. `detail.attribute` is the attribute to be
 * saved (return value of the event).
 */
export default class SaveAttributeEvent extends EventBase<
  EditAttributeEventDetail
> {
  static readonly TYPE = 'save-attribute';

  constructor(init?: CustomEventInit<EditAttributeEventDetail>) {
    super(SaveAttributeEvent.TYPE, init);
  }
}
