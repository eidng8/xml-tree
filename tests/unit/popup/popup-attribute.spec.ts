/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import {
  closePopup,
  enterRawXml,
  enterText,
  inputValue,
  rawValue,
  savePopup,
} from '../helpers';
import { SaveNodeMouseEvent, XmlAttribute } from '../../../src';
import PopupAttribute from '../../../src/components/popup/popup-attribute.vue';

let wrapper: Wrapper<PopupAttribute>;
let attribute: XmlAttribute;

afterEach(() => wrapper.destroy());

describe('element attribute', () => {
  beforeEach(() => {
    attribute = { name: 'ta', value: 'abc' };
    wrapper = mount(PopupAttribute, { propsData: { attribute } });
  });

  it('creates a modal box', () => {
    expect.assertions(2);
    expect(inputValue(wrapper, 'input')).toBe('ta');
    expect(rawValue(wrapper)).toBe('abc');
  });

  it('can edit attribute name', async () => {
    expect.assertions(2);
    await enterText(wrapper, 'input', 'b');
    await savePopup(wrapper);
    const emitted = wrapper.emitted().save[0][0] as SaveNodeMouseEvent;
    expect(emitted.data).toEqual({ name: 'b', value: 'abc' });
    expect(attribute).toEqual({ name: 'b', value: 'abc' });
  });

  it('can edit attribute value', async () => {
    expect.assertions(2);
    await enterRawXml(wrapper, 'b\nc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted().save[0][0] as SaveNodeMouseEvent;
    expect(emitted.data).toEqual({ name: 'ta', value: 'b\nc' });
    expect(attribute).toEqual({ name: 'ta', value: 'b\nc' });
  });

  it('can be canceled', async () => {
    expect.assertions(3);
    await enterText(wrapper, 'input', 'b');
    await closePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted.save).toBeUndefined();
    expect(emitted.close.length).toBe(1);
    expect(attribute).toEqual({ name: 'ta', value: 'abc' });
  });
});
