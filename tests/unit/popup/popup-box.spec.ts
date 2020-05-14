/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { click, keyup, savePopup } from '../helpers';
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
    expect.assertions(2);
    await click(wrapper, '.g8-xml__popup__header__close');
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `close` event when cancel button is clicked', async () => {
    expect.assertions(2);
    await click(wrapper, '.g8-xml__popup__footer button:last-child');
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `save` event when save button is clicked', async () => {
    expect.assertions(2);
    await savePopup(wrapper);
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().save.length).toBe(1);
  });

  it('emits `close` event when ESC is pressed', async () => {
    expect.assertions(2);
    await keyup(wrapper, 'Escape');
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('emits `save` event when Enter is pressed', async () => {
    expect.assertions(2);
    await keyup(wrapper, 'Enter');
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().save.length).toBe(1);
  });
});

describe('slot', () => {
  beforeEach(
    () =>
      (wrapper = mount(PopupBox, { scopedSlots: { default: '<textarea/>' } })),
  );

  it('emits `save` event when Ctrl+Enter is pressed', async () => {
    expect.assertions(2);
    wrapper.find('textarea').element.focus();
    await keyup(wrapper, 'Enter', { ctrlKey: true });
    expect(wrapper.emittedByOrder().length).toBe(1);
    expect(wrapper.emitted().save.length).toBe(1);
  });
});
