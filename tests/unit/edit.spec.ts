/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import {
  click,
  enterText,
  expandTreeNode,
  inputValue,
  rawValue,
  rightClick,
  rightClickBadge,
  rightClickDeclaration,
  savePopup,
} from './helpers';

const first = '.g8-tree__node:nth-child(2)';

describe('Node editing', () => {
  it('edits declaration node', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClickDeclaration(wrapper);
    await enterText(wrapper, 'input', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['declaration-changed'].length).toBe(1);
    expect(wrapper.find('.g8-tree__node').text()).toMatch(
      /version="1.0"\s+encoding="abc"\s+standalone="no"/,
    );
  });

  it('edits CDATA node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<![CDATA[a]]><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<![CDATA[a]]>');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits comment node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!--a--><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<!--a-->');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits DOCTYPE node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!DOCTYPE note SYSTEM "note.dtd"><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<!DOCTYPE note SYSTEM "note.dtd">');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits element node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<root/>');
    await enterText(wrapper, 'input', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits process instruction with attribute', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: {
        xml: '<?test abc="def"?><root/>',
        showAttrValue: true,
        piUseAttribute: true,
      },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<?test abc="def"?>');
    await enterText(wrapper, 'input', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toMatch(/abc\s+abc\s*="def"/);
  });

  it('edits process instruction without attribute', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<?test abc="def"?><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<?test abc="def"?>');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toBe('test abc');
  });

  it('edits text node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root>test</root>' },
    });
    await expandTreeNode(wrapper, first);
    await rightClick(wrapper, `${first} .g8-tree__node`);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('test');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    expect(wrapper.find(`${first} .g8-tree__node`).text()).toBe('abc');
  });
});

describe('Attribute editing', () => {
  it('edits element attribute', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root test="abc"/>', showAttrValue: true },
    });
    await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
    expect(inputValue(wrapper, 'input')).toBe('test');
    expect(inputValue(wrapper, 'textarea')).toBe('abc');
    await enterText(wrapper, 'input', 'abc');
    await enterText(wrapper, 'textarea', 'def');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['attribute-changed'].length).toBe(1);
    expect(wrapper.find(first).text()).toMatch(/root\s+abc\s*="def"/);
  });
});
