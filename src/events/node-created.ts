/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EventBase from './event-base';
import { XmlNode } from '../types/types';

/**
 * A node has be created. The `detail` field holds information about the
 * node being created.
 */
export default class NodeCreatedEvent extends EventBase<XmlNode> {
  static readonly TYPE = 'node-created';

  constructor(init?: CustomEventInit<XmlNode>) {
    super(NodeCreatedEvent.TYPE, init);
  }
}
