/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditAttributeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * An attribute is about to be edited. The `detail` field holds information
 * about the attribute to be edited.
 */
export default class EditAttributeEvent extends EventBase<
  EditAttributeEventDetail
> {
  static readonly TYPE = 'edit-attribute';

  constructor(init?: CustomEventInit<EditAttributeEventDetail>) {
    super(EditAttributeEvent.TYPE, init);
  }
}
