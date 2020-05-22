/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EventBase from './event-base';
import { XmlRoot } from '../types/types';

/**
 * The XML content has be reloaded, converted into a new XML object. This event
 * is not cancelable.
 */
export default class XmlReloadEvent extends EventBase<XmlRoot> {
  static readonly TYPE = 'xml-reload';

  constructor(init?: CustomEventInit<XmlRoot>) {
    super(XmlReloadEvent.TYPE, Object.assign({}, init, { cancelable: false }));
  }
}
