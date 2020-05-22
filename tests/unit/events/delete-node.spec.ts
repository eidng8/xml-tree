/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { DeleteNodeEvent, EditNodeEventDetail, G8XmlEdit } from '../../../src';
import { click, expandTreeNode, rightClick } from '../helpers';

const root = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
  });
  await expandTreeNode(wrapper, root);
  await rightClick(wrapper, `${root} .g8-tree__node`);
  await click(wrapper, '#g8-xml-menu-remove');
  const emitted = wrapper.emitted()[DeleteNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<EditNodeEventDetail>;
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.node.parent;
  // Execution pass right through everything if no listener were registered.
  // So when we catch the event, everything has been done,
  // and the node is gone.
  expect(evt.detail).toEqual({
    index: 0,
    document: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'root', nodes: [], rendered: true }],
    },
    parent: { type: 'element', name: 'root', nodes: [], rendered: true },
    node: { type: 'element', name: 'abc' },
  });
});

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
    listeners: {
      [DeleteNodeEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await expandTreeNode(wrapper, root);
  await rightClick(wrapper, `${root} .g8-tree__node`);
  await click(wrapper, '#g8-xml-menu-remove');
  const emitted = wrapper.emitted()[DeleteNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<EditNodeEventDetail>;
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.node.parent;
  expect(evt.detail).toEqual({
    index: 0,
    document: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [
        {
          type: 'element',
          name: 'root',
          nodes: [{ type: 'element', name: 'abc' }],
          rendered: true,
        },
      ],
    },
    parent: {
      type: 'element',
      name: 'root',
      nodes: [{ type: 'element', name: 'abc' }],
      rendered: true,
    },
    node: { type: 'element', name: 'abc' },
  });
});
