/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit, NodeCreatedEvent, XmlNode } from '../../../src';
import { click, enterText, rightClick, savePopup } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-prepend-child');
  await click(wrapper, '#g8-xml-menu-prepend-child-element');
  await enterText(wrapper, 'abc');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[NodeCreatedEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<XmlNode>;
  delete evt.detail!.parent;
  expect(evt.detail).toEqual({ type: 'element', name: 'abc' });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [NodeCreatedEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-prepend-child');
  await click(wrapper, '#g8-xml-menu-prepend-child-element');
  await enterText(wrapper, 'abc');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[NodeCreatedEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
