/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  EditAttributeEventDetail,
  G8XmlEdit,
  SaveAttributeEvent,
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
  const emitted = wrapper.emitted()[SaveAttributeEvent.TYPE];
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

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
    listeners: {
      [SaveAttributeEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  await enterText(wrapper, 'def', 'textarea');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[SaveAttributeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.vm.toString()).toBe(
    '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n<root test="abc"/>',
  );
});

it('uses return value in `detail`', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root test="abc"/>' },
    listeners: {
      [SaveAttributeEvent.TYPE]: (
        evt: CustomEvent<EditAttributeEventDetail>,
      ) => {
        evt.detail.attribute.value = 'ghi';
      },
    },
  });
  await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
  await enterText(wrapper, 'def', 'textarea');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[SaveAttributeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.vm.toString()).toBe(
    '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n<root test="ghi"/>',
  );
});
