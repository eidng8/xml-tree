/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  EditNodeEventDetail,
  G8XmlEdit,
  SaveNodeEvent,
  XmlElement,
} from '../../../src';
import { click, enterText, rightClick, savePopup } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  await enterText(wrapper, 'abc');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[SaveNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<EditNodeEventDetail>;
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.node.parent;
  expect(evt.detail).toEqual({
    creating: false,
    index: 0,
    document: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'abc' }],
    },
    parent: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'abc' }],
    },
    node: { type: 'element', name: 'abc' },
  });
});

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [SaveNodeEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  await enterText(wrapper, 'abc');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[SaveNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.vm.toString()).toBe(
    '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n<root/>',
  );
});

it('uses return value in `detail`', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [SaveNodeEvent.TYPE]: (evt: CustomEvent<EditNodeEventDetail>) => {
        (evt.detail.node as XmlElement).name = 'abc';
      },
    },
  });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  await enterText(wrapper, 'abc');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[SaveNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.vm.toString()).toBe(
    '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n<abc/>',
  );
});
