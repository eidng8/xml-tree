/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DocumentDetail } from '../types/events';
import EventBase from './event-base';

/**
 * The XML content has be reloaded, converted into a new XML object.
 */
export default class XmlReloadEvent extends EventBase<DocumentDetail> {
  static readonly TYPE = 'xml-reload';

  constructor(init?: CustomEventInit<DocumentDetail>) {
    super(XmlReloadEvent.TYPE, init);
  }
}
