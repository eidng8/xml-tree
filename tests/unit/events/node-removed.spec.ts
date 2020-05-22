/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit, NodeRemovedEvent, XmlNode } from '../../../src';
import { click, expandTreeNode, rightClick } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
  });
  await expandTreeNode(wrapper, first);
  await rightClick(wrapper, `${first} .g8-tree__node`);
  await click(wrapper, '#g8-xml-menu-remove');
  const emitted = wrapper.emitted()[NodeRemovedEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<XmlNode>;
  delete evt.detail!.parent;
  expect(evt.detail).toEqual({ type: 'element', name: 'abc' });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root><abc/></root>' },
    listeners: {
      [NodeRemovedEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await expandTreeNode(wrapper, first);
  await rightClick(wrapper, `${first} .g8-tree__node`);
  await click(wrapper, '#g8-xml-menu-remove');
  const emitted = wrapper.emitted()[NodeRemovedEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
