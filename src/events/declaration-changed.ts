/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EventBase from './event-base';
import { XmlDeclaration } from '../types/types';

/**
 * Declaration has be changed. The `detail` field holds information about the
 * new declaration. This event is not cancelable.
 */
export default class DeclarationChangedEvent extends EventBase<XmlDeclaration> {
  static readonly TYPE = 'declaration-changed';

  constructor(init?: CustomEventInit<XmlDeclaration>) {
    super(
      DeclarationChangedEvent.TYPE,
      Object.assign({}, init, { cancelable: false }),
    );
  }
}
