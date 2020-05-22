/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  EditAttributeEvent,
  EditAttributeEventDetail,
  G8XmlEdit,
} from '../../../src';
import { rightClickBadge } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  const emitted = wrapper.emitted()[EditAttributeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<EditAttributeEventDetail>;
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
          attributes: [{ name: 'test', value: 'abc' }],
        },
      ],
    },
    node: {
      type: 'element',
      name: 'root',
      attributes: [{ name: 'test', value: 'abc' }],
    },
    attribute: { name: 'test', value: 'abc' },
  });
});

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
    listeners: {
      [EditAttributeEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  const emitted = wrapper.emitted()[EditAttributeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.find('.g8-xml__popup').exists()).toBeFalsy();
});

it('uses return value in `detail`', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
    listeners: {
      [EditAttributeEvent.TYPE]: (
        evt: CustomEvent<EditAttributeEventDetail>,
      ) => {
        evt.detail.attribute.value = 'abc';
      },
    },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  const emitted = wrapper.emitted()[EditAttributeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(
    (wrapper.find('.g8-xml__popup textarea').element as HTMLTextAreaElement)
      .value,
  ).toBe('abc');
});
