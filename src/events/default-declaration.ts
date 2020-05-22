/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DefaultDeclarationEventDetail } from '../types/events';
import EventBase from './event-base';

/**
 * Emitted when the XML document doesn't have a declaration. The `detail` field
 * holds information about the event:
 *
 * - `detail.document` field holds the loaded XML object. There may be
 * declaration in this object.
 * - `detail.declaration` field is the return value of this event, which will
 * be set to the loaded document. If this field is `undefined` upon return,
 * a sensible default value will be used.
 */
export default class DefaultDeclarationEvent extends EventBase<
  DefaultDeclarationEventDetail
> {
  static readonly TYPE = 'default-declaration';

  constructor(init?: CustomEventInit<DefaultDeclarationEventDetail>) {
    super(DefaultDeclarationEvent.TYPE, init);
  }
}
