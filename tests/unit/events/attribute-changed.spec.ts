/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  AttributeChangedEvent,
  EditAttributeEventDetail,
  G8XmlEdit,
} from '../../../src';
import { enterText, rightClickBadge, savePopup } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  await enterText(wrapper, 'def', 'textarea');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[AttributeChangedEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<EditAttributeEventDetail>;
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.node.parent;
  expect(evt.detail).toEqual({
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
          attributes: [{ name: 'test', value: 'def' }],
        },
      ],
    },
    node: {
      type: 'element',
      name: 'root',
      attributes: [{ name: 'test', value: 'def' }],
    },
    attribute: { name: 'test', value: 'def' },
  });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
    listeners: {
      [AttributeChangedEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  await enterText(wrapper, 'def', 'textarea');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[AttributeChangedEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
