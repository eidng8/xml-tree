/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import { click, expandTreeNode, rightClick } from './helpers';

describe('Node removal', () => {
  const root = '.g8-tree__node:nth-child(2)';

  it('removes CDATA node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<![CDATA[a]]><root/>' },
    });
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, root);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });

  it('removes comment node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!--a--><root/>' },
    });
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, root);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });

  it('removes DOCTYPE node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!DOCTYPE root [<!ELEMENT to (#PCDATA)>]><root/>' },
    });
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, root);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });

  it('removes processing instruction node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<?pi?><root/>' },
    });
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, root);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });

  it('removes text node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root>abc</root>' },
    });
    await expandTreeNode(wrapper, root);
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, `${root} .g8-tree__node`);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });

  it('removes element node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root><abc/></root>' },
    });
    await expandTreeNode(wrapper, root);
    expect(wrapper.findAll('.g8-tree__node').length).toBe(3);
    await rightClick(wrapper, `${root} .g8-tree__node`);
    await click(wrapper, '#g8-xml-menu-remove');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(2);
  });
});
