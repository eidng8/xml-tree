/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import {
  click,
  enterText,
  expandTreeNode,
  rightClick,
  savePopup,
} from './helpers';

const first = '.g8-tree__node:nth-child(2)';
const second = '.g8-tree__node:last-child';

let wrapper: Wrapper<G8XmlEdit>;

describe('Node insertion', () => {
  beforeEach(() => {
    wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  });

  it('inserts CDATA node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-insert-after');
    await click(wrapper, '#g8-xml-menu-insert-after-cdata');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'cdata',
      cdata: 'abc',
    });
    expect(wrapper.find(second).text()).toBe('abc');
  });

  it('inserts comment node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-insert-before');
    await click(wrapper, '#g8-xml-menu-insert-before-comment');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'comment',
      comment: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('inserts DOCTYPE node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-insert-before');
    await click(wrapper, '#g8-xml-menu-insert-before-doctype');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'doctype',
      doctype: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('inserts process instruction node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-insert-before');
    await click(wrapper, '#g8-xml-menu-insert-before-instruction');
    await enterText(wrapper, 'input', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'instruction',
      name: 'abc',
      instruction: '',
    });
    expect(wrapper.find(first).text()).toEqual('abc');
  });
});

describe('Child node insertion', () => {
  beforeEach(() => {
    wrapper = mount(G8XmlEdit, { propsData: { xml: '<root><a/></root>' } });
  });

  it('appends text to element node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-append-child');
    await click(wrapper, '#g8-xml-menu-append-child-text');
    await enterText(wrapper, 'textarea', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'text',
      text: 'abc',
    });
    await expandTreeNode(wrapper, first);
    expect(wrapper.find(`${first} .g8-tree__node:last-child`).text()).toBe(
      'abc',
    );
  });

  it('prepends to element node', async () => {
    expect.assertions(3);
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-prepend-child');
    await click(wrapper, '#g8-xml-menu-prepend-child-element');
    await enterText(wrapper, 'input', 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-created'].length).toBe(1);
    delete emitted['node-created'][0][0].parent;
    expect(emitted['node-created'][0][0]).toEqual({
      type: 'element',
      name: 'abc',
      attributes: [],
    });
    await expandTreeNode(wrapper, first);
    expect(wrapper.find(`${first} .g8-tree__node`).text()).toBe('abc');
  });
});
