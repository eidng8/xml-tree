/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EventBase from './event-base';
import { XmlNode } from '../types/types';

/**
 * A node has be removed. The `detail` field holds information about the
 * removed node.
 */
export default class NodeRemovedEvent extends EventBase<XmlNode> {
  static readonly TYPE = 'node-removed';

  constructor(init?: CustomEventInit<XmlNode>) {
    super(NodeRemovedEvent.TYPE, init);
  }
}
