/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  DeclarationChangedEvent,
  G8XmlEdit,
  XmlDeclaration,
} from '../../../src';
import { enterText, rightClickDeclaration, savePopup } from '../helpers';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  await rightClickDeclaration(wrapper);
  await enterText(wrapper, 'ascii');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[DeclarationChangedEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<XmlDeclaration>;
  delete evt.detail!.parent;
  expect(evt.detail).toEqual({
    attributes: [
      { name: 'version', value: '1.0' },
      { name: 'encoding', value: 'ascii' },
      { name: 'standalone', value: 'no' },
    ],
  });
});

it('is not cancellable', async () => {
  expect.assertions(2);
  let event: Event;
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [DeclarationChangedEvent.TYPE]: (evt: Event) => {
        event = evt;
        evt.preventDefault();
      },
    },
  });
  await rightClickDeclaration(wrapper);
  await enterText(wrapper, 'ascii');
  await savePopup(wrapper);
  const emitted = wrapper.emitted()[DeclarationChangedEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(event!.defaultPrevented).toBe(false);
});
