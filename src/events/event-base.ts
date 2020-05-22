/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export default abstract class EventBase<T> extends CustomEvent<T> {
  protected constructor(type: string, init?: CustomEventInit<T>) {
    super(type, Object.assign({ cancelable: true }, init));
  }
}
