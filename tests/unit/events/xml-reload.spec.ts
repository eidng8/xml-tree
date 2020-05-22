/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit, XmlReloadEvent, XmlRoot } from '../../../src';
import { rightClick } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  const emitted = wrapper.emitted()[XmlReloadEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<XmlRoot>;
  delete evt.detail!.declaration.parent;
  delete evt.detail!.nodes![0].parent;
  expect(evt.detail).toEqual({
    declaration: {
      attributes: [
        { name: 'version', value: '1.0' },
        { name: 'encoding', value: 'utf-8' },
        { name: 'standalone', value: 'no' },
      ],
    },
    nodes: [{ type: 'element', name: 'root' }],
  });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [XmlReloadEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await rightClick(wrapper, first);
  const emitted = wrapper.emitted()[XmlReloadEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
