/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Wrapper } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';

export async function click(wrapper: Wrapper<G8XmlEdit>, node: string) {
  wrapper.find(`${node} .g8-tree__node__entry`).trigger('click');
  await wrapper.vm.$nextTick();
}

export async function rightClick(wrapper: Wrapper<G8XmlEdit>, node: string) {
  wrapper
    .find(`${node} .g8-tree__node__entry__label>:first-child`)
    .trigger('contextmenu');
  await wrapper.vm.$nextTick();
}
