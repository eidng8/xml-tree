/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { defaultDeclaration, XmlDeclaration } from '../../../src';
import PopupDeclaration from '../../../src/components/popup/popup-declaration.vue';
import { savePopup } from '../helpers';

let wrapper: Wrapper<PopupDeclaration>;

afterEach(() => wrapper.destroy());

describe('basics', () => {
  it('creates a modal box', () => {
    expect.assertions(1);
    wrapper = mount(PopupDeclaration, {
      propsData: { node: defaultDeclaration() },
    });
    expect(wrapper.findAll('select').length).toBe(2);
  });

  it('fills in default attributes with empty values', async () => {
    expect.assertions(5);
    wrapper = mount(PopupDeclaration, { propsData: { node: {} } });
    expect(wrapper.findAll('select').length).toBe(2);
    const s = wrapper.findAll('select');
    expect((s.at(0).element as HTMLSelectElement).value).toBe('');
    expect((s.at(1).element as HTMLSelectElement).value).toBe('');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
    await savePopup(wrapper);
    const node = wrapper.emitted().save[0][0].data as XmlDeclaration;
    expect(node.attributes).toEqual([
      { name: 'version', value: undefined },
      { name: 'encoding', value: undefined },
      { name: 'standalone', value: undefined },
    ]);
  });

  it('does not overwrite attributes values', async () => {
    expect.assertions(5);
    wrapper = mount(PopupDeclaration, {
      propsData: { node: { attributes: [{ name: 'version', value: '1.0' }] } },
    });
    expect(wrapper.findAll('select').length).toBe(2);
    const s = wrapper.findAll('select');
    expect((s.at(0).element as HTMLSelectElement).value).toBe('1.0');
    expect((s.at(1).element as HTMLSelectElement).value).toBe('');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
    await savePopup(wrapper);
    const node = wrapper.emitted().save[0][0].data as XmlDeclaration;
    expect(node.attributes).toEqual([
      { name: 'version', value: '1.0' },
      { name: 'encoding', value: undefined },
      { name: 'standalone', value: undefined },
    ]);
  });
});
