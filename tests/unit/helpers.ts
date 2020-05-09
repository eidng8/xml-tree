/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Wrapper } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';

export async function expandTreeNode(
  wrapper: Wrapper<G8XmlEdit>,
  node: string,
): Promise<void> {
  return wrapper.find(`${node} .g8-tree__node__entry`).trigger('click');
}

export async function rightClick(
  wrapper: Wrapper<G8XmlEdit>,
  node: string,
): Promise<void> {
  return wrapper
    .find(`${node} .g8-tree__node__entry__label>:first-child`)
    .trigger('contextmenu');
}

export async function click(
  wrapper: Wrapper<G8XmlEdit>,
  item: string,
): Promise<void> {
  return wrapper.find(item).trigger('click');
}

export async function keyup(
  wrapper: Wrapper<G8XmlEdit>,
  key: string,
  opts = {} as KeyboardEventInit,
  element?: Document | Element,
): Promise<void> {
  const evt = new KeyboardEvent('keyup', Object.assign({ key }, opts));
  (element || document).dispatchEvent(evt);
  return wrapper.vm.$nextTick();
}
