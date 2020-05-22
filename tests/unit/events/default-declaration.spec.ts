/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  DefaultDeclarationEvent,
  DefaultDeclarationEventDetail,
  G8XmlEdit,
  XmlDeclaration,
} from '../../../src';

it('triggers event', () => {
  expect.assertions(3);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  const emitted = wrapper.emitted()[DefaultDeclarationEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<DefaultDeclarationEventDetail>;
  expect(evt.detail!.declaration).toBeUndefined();
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  expect(evt.detail).toEqual({
    document: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'root' }],
    },
  });
});

it('does not trigger event if declaration present', () => {
  expect.assertions(1);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<?xml version="1.0"?><root/>' },
  });
  expect(wrapper.emitted()[DefaultDeclarationEvent.TYPE]).toBeUndefined();
});

it('is cancellable', () => {
  expect.assertions(3);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [DefaultDeclarationEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  const emitted = wrapper.emitted()[DefaultDeclarationEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<DefaultDeclarationEventDetail>;
  expect(evt.detail!.declaration).toBeUndefined();
  delete evt.detail!.document.nodes![0].parent;
  expect(evt.detail).toEqual({
    document: { nodes: [{ type: 'element', name: 'root' }] },
  });
});

it('uses return value in `detail`', () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [DefaultDeclarationEvent.TYPE]: (
        evt: CustomEvent<DefaultDeclarationEventDetail>,
      ) => {
        evt.detail.declaration = ({
          attributes: [{ name: 'version', value: '1.1' }],
        } as unknown) as XmlDeclaration;
      },
    },
  });
  const emitted = wrapper.emitted()[DefaultDeclarationEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEventInit<DefaultDeclarationEventDetail>;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.document.declaration.parent;
  expect(evt.detail).toEqual({
    document: {
      declaration: { attributes: [{ name: 'version', value: '1.1' }] },
      nodes: [{ type: 'element', name: 'root' }],
    },
    declaration: { attributes: [{ name: 'version', value: '1.1' }] },
  });
});
