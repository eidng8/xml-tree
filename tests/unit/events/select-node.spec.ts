/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  G8XmlEdit,
  SelectNodeEvent,
  SelectNodeEventDetail,
  XmlElement,
  XmlRoot,
} from '../../../src';
import { expandTreeNode, rightClick } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
  });
  await expandTreeNode(wrapper, first);
  const emitted = wrapper.emitted()[SelectNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<SelectNodeEventDetail>;
  delete evt.detail!.node.parent;
  delete (evt.detail!.node as XmlElement).nodes![0].parent;
  delete (evt.detail!.parent as XmlRoot).declaration.parent;
  expect(evt.detail).toEqual({
    expanded: true,
    index: 0,
    parent: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [
        {
          rendered: true,
          type: 'element',
          name: 'root',
          nodes: [{ type: 'element', name: 'abc' }],
        },
      ],
    },
    node: {
      rendered: true,
      type: 'element',
      name: 'root',
      nodes: [{ type: 'element', name: 'abc' }],
    },
  });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
    listeners: {
      [SelectNodeEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await rightClick(wrapper, first);
  const emitted = wrapper.emitted()[SelectNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
