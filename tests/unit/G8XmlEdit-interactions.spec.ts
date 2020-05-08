/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import { click, rightClick } from './helpers';

describe('XML interactions', () => {
  const root = '.g8-xml__tree>.g8-tree__node:nth-child(2)';

  it('hides right click menu initially', () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    expect(wrapper.find('.g8-menu--off').exists()).toBe(true);
  });

  it('pops up right click menu', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, root);
    expect(wrapper.find('.g8-menu--off').exists()).toBe(false);
    const text = wrapper.find('.g8-menu').text();
    expect(text).toContain('append');
    expect(text).toContain('prepend');
  });

  it('does not allow removing root node', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, root);
    const text = wrapper.find('.g8-menu').text();
    expect(text).not.toContain('remove');
  });

  it('does not allow inserting child to CDATA', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<![CDATA[a]]><root/>' },
    });
    await rightClick(wrapper, root);
    const text = wrapper.find('.g8-menu').text();
    expect(text).not.toContain('append');
    expect(text).not.toContain('prepend');
  });

  it('does not allow inserting child to comment', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!--a--><root/>' },
    });
    await rightClick(wrapper, root);
    const text = wrapper.find('.g8-menu').text();
    expect(text).not.toContain('append');
    expect(text).not.toContain('prepend');
  });

  it('does not allow inserting child to DOCTYPE', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!DOCTYPE root [<!ELEMENT to (#PCDATA)>]><root/>' },
    });
    await rightClick(wrapper, root);
    const text = wrapper.find('.g8-menu').text();
    expect(text).not.toContain('append');
    expect(text).not.toContain('prepend');
  });

  it('does not allow inserting child to instruction', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<?pi?><root/>' },
    });
    await rightClick(wrapper, root);
    const text = wrapper.find('.g8-menu').text();
    expect(text).not.toContain('append');
    expect(text).not.toContain('prepend');
  });

  it('does not allow inserting child to text', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root>abc</root>' },
    });
    await click(wrapper, root);
    await rightClick(wrapper, `${root} .g8-tree__node`);
    const text = wrapper.find('.g8-menu').text();
    expect(text).toContain('remove');
    expect(text).not.toContain('append');
    expect(text).not.toContain('prepend');
  });

  it('does not allow inserting element after root', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root></root>' },
    });
    await rightClick(wrapper, root);
    wrapper.find('#g8-xml-menu-insert-after').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-menu').text()).not.toContain('element');
  });

  it('does not allow inserting element before root', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root></root>' },
    });
    await rightClick(wrapper, root);
    wrapper.find('#g8-xml-menu-insert-before').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-menu').text()).not.toContain('element');
  });

  it('does not allow inserting text to root level', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root></root>' },
    });
    await rightClick(wrapper, root);
    wrapper.find('#g8-xml-menu-insert-before').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-menu').text()).not.toContain('text');
  });
});
