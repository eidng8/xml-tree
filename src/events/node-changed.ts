/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EventBase from './event-base';
import { XmlNode } from '../types/types';

/**
 * A node has be changed. The `detail` field holds information about the
 * node being changed. This event is not cancelable.
 */
export default class NodeChangedEvent extends EventBase<XmlNode> {
  static readonly TYPE = 'node-changed';

  constructor(init?: CustomEventInit<XmlNode>) {
    super(
      NodeChangedEvent.TYPE,
      Object.assign({}, init, { cancelable: false }),
    );
  }
}
