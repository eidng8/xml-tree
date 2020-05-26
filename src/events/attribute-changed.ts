/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EditAttributeEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * An attribute is about to be changed. The `detail` field holds information
 * about the changed attribute. This event is not cancelable.
 */
export default class AttributeChangedEvent extends EventBase<
  EditAttributeEventDetail
> {
  static readonly TYPE = 'attribute-changed';

  constructor(init?: CustomEventInit<EditAttributeEventDetail>) {
    super(
      AttributeChangedEvent.TYPE,
      Object.assign({}, init, { cancelable: false }),
    );
  }
}
