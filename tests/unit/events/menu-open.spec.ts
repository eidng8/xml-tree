/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  G8XmlEdit,
  MenuOpenEvent,
  MenuOpenEventDetail,
  XmlElement,
} from '../../../src';
import { rightClick } from '../helpers';

const root = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(5);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  await rightClick(wrapper, root);
  const emitted = wrapper.emitted()[MenuOpenEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<MenuOpenEventDetail>;
  expect(evt.detail.items).toBeInstanceOf(Array);
  expect(evt.detail.originalEvent).toBeInstanceOf(MouseEvent);
  expect((evt.detail.node as XmlElement).name).toBe('root');
  expect(evt.detail.rootLevel).toBe(true);
});

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [MenuOpenEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await rightClick(wrapper, root);
  const emitted = wrapper.emitted()[MenuOpenEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.find('.g8-menu--off').exists()).toBeTruthy();
});

it('uses return value in `detail`', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [MenuOpenEvent.TYPE]: (evt: CustomEvent<MenuOpenEventDetail>) => {
        evt.detail.items = [{ id: 'abc', label: 'abc' }];
      },
    },
  });
  await rightClick(wrapper, root);
  const emitted = wrapper.emitted()[MenuOpenEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.find('#abc').exists()).toBeTruthy();
});
