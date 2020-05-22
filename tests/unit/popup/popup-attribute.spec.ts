/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { closePopup, enterRawXml, rawValue, savePopup } from '../helpers';
import { SaveNodeMouseEvent, XmlAttribute } from '../../../src';
import PopupAttribute from '../../../src/components/popup/popup-attribute.vue';

let wrapper: Wrapper<PopupAttribute>;
let attribute: XmlAttribute;

afterEach(() => wrapper.destroy());

describe('element attribute', () => {
  beforeEach(() => {
    attribute = { name: 'ta', value: 'abc' };
    wrapper = mount(PopupAttribute, {
      propsData: { attribute },
    });
  });

  it('creates a modal box', () => {
    expect.assertions(2);
    expect(wrapper.find('.g8-xml__popup__header__title').text()).toBe('ta');
    expect(rawValue(wrapper)).toBe('abc');
  });

  it('can edit attribute value', async () => {
    expect.assertions(1);
    await enterRawXml(wrapper, 'b\nc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted().save[0][0] as SaveNodeMouseEvent;
    expect(emitted.data).toEqual({ name: 'ta', value: 'b\nc' });
  });

  it('can be canceled', async () => {
    expect.assertions(3);
    await enterRawXml(wrapper, 'b\nc');
    await closePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted.save).toBeUndefined();
    expect(emitted.close.length).toBe(1);
    expect(attribute).toEqual({ name: 'ta', value: 'abc' });
  });
});
