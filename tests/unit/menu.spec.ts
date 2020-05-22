/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import NodeMenu from '../../src/components/menus/node-menu.vue';

describe('menu', () => {
  it('generates menu', () => {
    const wrapper = mount(NodeMenu);
    (wrapper.vm as any).open({ type: 'abc' });
    expect(wrapper.find('.g8-menu--off').exists()).toBe(false);
  });

  it('generates menu for root level node', () => {
    const wrapper = mount(NodeMenu);
    (wrapper.vm as any).open({ name: 'abc' }, true);
    expect(wrapper.find('.g8-menu--off').exists()).toBe(false);
  });
});
