/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DefaultDeclarationEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * Emitted when the XML document doesn't have a declaration. The default
 * behavior of this event is to combine the build-in default declaration and the
 * `detail.declaration`. Call `preventDefault()` on the event if the default
 * behavior is not desired. The `detail` field holds information
 * about the event:
 *
 * - `detail.document` field holds the loaded XML object,
 * - `detail.declaration` field is the return value of the event, which will
 * be set to the loaded document.
 */
export default class DefaultDeclarationEvent extends EventBase<
  DefaultDeclarationEventDetail
> {
  static readonly TYPE = 'default-declaration';

  constructor(init?: CustomEventInit<DefaultDeclarationEventDetail>) {
    super(DefaultDeclarationEvent.TYPE, init);
  }
}
