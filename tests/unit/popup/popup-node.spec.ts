/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import PopupNode from '../../../src/components/popup/popup-node.vue';
import {
  addAttribute,
  click,
  enterRawXml,
  enterText,
  rawValue,
  savePopup,
} from '../helpers';
import { SaveNodeMouseEvent } from '../../../src';

let wrapper: Wrapper<PopupNode>;

afterEach(() => wrapper.destroy());

describe('element node', () => {
  beforeEach(() => {
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'element',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
  });

  it('creates a modal box', () => {
    expect.assertions(1);
    expect(rawValue(wrapper)).toBe('<test ta="abc"/>');
  });

  it('updates raw field', async () => {
    expect.assertions(3);
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, inputs.at(0), 'abc');
    expect(rawValue(wrapper)).toBe('<abc ta="abc"/>');
    await enterText(wrapper, inputs.at(1), 'def');
    expect(rawValue(wrapper)).toBe('<abc def="abc"/>');
    await enterText(wrapper, inputs.at(2), 'ghi');
    expect(rawValue(wrapper)).toBe('<abc def="ghi"/>');
  });

  it('can remove attribute', async () => {
    expect.assertions(1);
    await click(wrapper, '.g8-xml__popup__attributes button');
    expect(rawValue(wrapper)).toBe('<test/>');
  });

  it('can add attribute', async () => {
    expect.assertions(1);
    await addAttribute(wrapper);
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, inputs.at(3), 'abc');
    await enterText(wrapper, inputs.at(4), 'def');
    expect(rawValue(wrapper)).toBe('<test ta="abc" abc="def"/>');
  });

  it('can edit raw', async () => {
    expect.assertions(1);
    await enterRawXml(wrapper, '<a b="c"/>');
    await savePopup(wrapper);
    const emitted = wrapper.emitted().save[0][0] as SaveNodeMouseEvent;
    expect(emitted.data).toEqual({
      type: 'element',
      name: 'a',
      attributes: [{ name: 'b', value: 'c' }],
    });
  });

  it('shows error message about raw', async () => {
    expect.assertions(3);
    await enterRawXml(wrapper, '<a b/>');
    expect(wrapper.find('.g8--error').exists()).toBe(true);
    const msg = wrapper.find('.g8-xml__popup__message');
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toBe('Invalid XML');
  });

  it('shows error message about tag name', async () => {
    expect.assertions(3);
    await enterText(wrapper, 'input', '&');
    expect(wrapper.find('.g8--error').exists()).toBe(true);
    const msg = wrapper.find('.g8-xml__popup__message');
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toBe('Invalid XML');
  });

  it('shows error message about attribute', async () => {
    expect.assertions(3);
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, inputs.at(1), '&');
    expect(wrapper.find('.g8--error').exists()).toBe(true);
    const msg = wrapper.find('.g8-xml__popup__message');
    expect(msg.exists()).toBe(true);
    expect(msg.text()).toBe('Invalid XML');
  });
});
