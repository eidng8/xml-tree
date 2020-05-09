/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import { click, rightClick } from './helpers';

describe('Node editing', () => {
  const root = '.g8-tree__node:nth-child(2)';

  it('edits CDATA node', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<![CDATA[a]]><root/>' },
      // attachToDocument: true,
    });
    await rightClick(wrapper, root);
    await click(wrapper, '#g8-xml-menu-edit');
    // const input = document.activeElement as HTMLInputElement;
    // input.value = 'abc';
    // input.dispatchEvent(new InputEvent('input'));
    // await wrapper.vm.$nextTick();
    await click(wrapper, '.g8-xml__popup__footer button');
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
  });
});
