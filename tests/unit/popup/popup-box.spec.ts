/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { click, keyup } from '../helpers';
import PopupBox from '../../../src/components/popup/popup-box.vue';

let wrapper: Wrapper<PopupBox>;

afterEach(() => wrapper.destroy());

describe('basics', () => {
  beforeEach(() => (wrapper = mount(PopupBox)));

  it('creates a modal box', () => {
    expect.assertions(2);
    expect(wrapper.find('.g8-xml__popup').exists()).toBe(true);
    expect(wrapper.find('.g8-xml__popup__box').exists()).toBe(true);
  });

  it('supports `preventDefault()`', async () => {
    expect.assertions(1);
    const evt = new KeyboardEvent('keyup', Object.assign({ key: 'a' }));
    evt.preventDefault();
    document.dispatchEvent(evt);
    await wrapper.vm.$nextTick();
    expect(wrapper.emittedByOrder().length).toBe(0);
  });

  it('passes through non-related key press', () => {
    expect.assertions(1);
    keyup(wrapper, 'a');
    expect(wrapper.emittedByOrder().length).toBe(0);
  });

  it('emits `close` event when close button is clicked', async () => {
    expect.assertions(1);
    await click(wrapper, '.g8-xml__popup__header__close');
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `close` event when cancel button is clicked', async () => {
    expect.assertions(1);
    await click(wrapper, '.g8-xml__popup__footer button:last-child');
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `save` & `close` event when save button is clicked', async () => {
    expect.assertions(2);
    await click(wrapper, '.g8-xml__popup__footer button:first-child');
    const emitted = wrapper.emittedByOrder();
    expect(emitted[0].name).toBe('save');
    expect(emitted[1].name).toBe('close');
  });

  it('emits `close` event when ESC is pressed', async () => {
    expect.assertions(1);
    await keyup(wrapper, 'Escape');
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `save` & `close` event when Enter is pressed', async () => {
    expect.assertions(2);
    await keyup(wrapper, 'Enter');
    const emitted = wrapper.emittedByOrder();
    expect(emitted[0].name).toBe('save');
    expect(emitted[1].name).toBe('close');
  });
});

describe('slot', () => {
  beforeEach(
    () =>
      (wrapper = mount(PopupBox, { scopedSlots: { default: '<textarea/>' } })),
  );

  it('emits `save` & `close` event when Ctrl+Enter is pressed', async () => {
    expect.assertions(2);
    wrapper.find('textarea').element.focus();
    await keyup(wrapper, 'Enter', { ctrlKey: true });
    const emitted = wrapper.emittedByOrder();
    expect(emitted[0].name).toBe('save');
    expect(emitted[1].name).toBe('close');
  });
});
