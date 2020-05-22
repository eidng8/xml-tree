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
  closePopup,
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

  it('can remove attribute', async () => {
    expect.assertions(1);
    await click(wrapper, '.g8-xml__popup__attributes button');
    expect(rawValue(wrapper)).toBe('<test/>');
  });

  it('can add attribute', async () => {
    expect.assertions(1);
    await addAttribute(wrapper);
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, 'abc', inputs.at(3));
    await enterText(wrapper, 'def', inputs.at(4));
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

  it('checks tag name', async () => {
    expect.assertions(1);
    await enterText(wrapper, '&');
    expect(wrapper.find(':invalid').exists()).toBe(true);
  });

  it('shows error message about attribute', async () => {
    expect.assertions(1);
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, '&', inputs.at(1));
    expect(wrapper.find(':invalid').exists()).toBe(true);
  });

  it('can be canceled', async () => {
    expect.assertions(2);
    await enterText(wrapper, 'b');
    await closePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted.save).toBeUndefined();
    expect(emitted.close.length).toBe(1);
  });
});

describe('raw field', () => {
  it('updates CDATA field', async () => {
    expect.assertions(1);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'cdata', cdata: 'a' } },
    });
    await enterRawXml(wrapper, '<![CDATA[a]]>');
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value,
    ).toBe('a');
  });

  it('updates CDATA raw field', async () => {
    expect.assertions(2);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'cdata', cdata: 'a' } },
    });
    expect(rawValue(wrapper)).toBe('<![CDATA[a]]>');
    await enterText(wrapper, 'abc', 'textarea');
    expect(rawValue(wrapper)).toBe('<![CDATA[abc]]>');
  });

  it('updates comment field', async () => {
    expect.assertions(1);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'comment', comment: 'a' } },
    });
    await enterRawXml(wrapper, '<!--a-->');
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value,
    ).toBe('a');
  });

  it('updates comment raw field', async () => {
    expect.assertions(2);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'comment', comment: 'a' } },
    });
    expect(rawValue(wrapper)).toBe('<!--a-->');
    await enterText(wrapper, 'abc', 'textarea');
    expect(rawValue(wrapper)).toBe('<!--abc-->');
  });

  it('updates DOCTYPE field', async () => {
    expect.assertions(1);
    wrapper = mount(PopupNode, {
      propsData: {
        node: { type: 'doctype', doctype: 'note SYSTEM "note.dtd"' },
      },
    });
    await enterRawXml(wrapper, '<!DOCTYPE note SYSTEM "note.dtd">');
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value,
    ).toBe('note SYSTEM "note.dtd"');
  });

  it('updates DOCTYPE raw field', async () => {
    expect.assertions(2);
    wrapper = mount(PopupNode, {
      propsData: {
        node: { type: 'doctype', doctype: 'note SYSTEM "note.dtd"' },
      },
    });
    expect(rawValue(wrapper)).toBe('<!DOCTYPE note SYSTEM "note.dtd">');
    await enterText(wrapper, 'abc def "ghi"', 'textarea');
    expect(rawValue(wrapper)).toBe('<!DOCTYPE abc def "ghi">');
  });

  it('updates element field', async () => {
    expect.assertions(3);
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'element',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    await enterRawXml(wrapper, '<a b="c"/>');
    const inputs = wrapper.findAll('input');
    expect((inputs.at(0).element as HTMLInputElement).value).toBe('a');
    expect((inputs.at(1).element as HTMLInputElement).value).toBe('b');
    expect((inputs.at(2).element as HTMLInputElement).value).toBe('c');
  });

  it('updates element raw field', async () => {
    expect.assertions(3);
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'element',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, 'abc', inputs.at(0));
    expect(rawValue(wrapper)).toBe('<abc ta="abc"/>');
    await enterText(wrapper, 'def', inputs.at(1));
    expect(rawValue(wrapper)).toBe('<abc def="abc"/>');
    await enterText(wrapper, 'ghi', inputs.at(2));
    expect(rawValue(wrapper)).toBe('<abc def="ghi"/>');
  });

  it('updates process instruction with attribute field', async () => {
    expect.assertions(3);
    wrapper = mount(PopupNode, {
      propsData: {
        piUseAttribute: true,
        node: {
          type: 'instruction',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    await enterRawXml(wrapper, '<?a b="c"?>');
    const inputs = wrapper.findAll('input');
    expect((inputs.at(0).element as HTMLInputElement).value).toBe('a');
    expect((inputs.at(1).element as HTMLInputElement).value).toBe('b');
    expect((inputs.at(2).element as HTMLInputElement).value).toBe('c');
  });

  it('updates process instruction with attribute raw field', async () => {
    expect.assertions(4);
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'instruction',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    expect(rawValue(wrapper)).toBe('<?test ta="abc"?>');
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, 'abc', inputs.at(0));
    expect(rawValue(wrapper)).toBe('<?abc ta="abc"?>');
    await enterText(wrapper, 'def', inputs.at(1));
    expect(rawValue(wrapper)).toBe('<?abc def="abc"?>');
    await enterText(wrapper, 'ghi', inputs.at(2));
    expect(rawValue(wrapper)).toBe('<?abc def="ghi"?>');
  });

  it('updates process instruction without attribute field', async () => {
    expect.assertions(1);
    wrapper = mount(PopupNode, {
      propsData: {
        node: { type: 'instruction', name: 'test', instruction: 'asf' },
      },
    });
    await enterRawXml(wrapper, '<?abc asf?>');
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value,
    ).toBe('asf');
  });

  it('updates process instruction without attribute raw field', async () => {
    expect.assertions(2);
    wrapper = mount(PopupNode, {
      propsData: {
        node: { type: 'instruction', name: 'test', instruction: 'asf' },
      },
    });
    expect(rawValue(wrapper)).toBe('<?test asf?>');
    await enterText(wrapper, 'abc');
    expect(rawValue(wrapper)).toBe('<?abc asf?>');
  });

  it('updates text field', async () => {
    expect.assertions(1);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'text', text: 'test' } },
    });
    await enterRawXml(wrapper, 'abc');
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value,
    ).toBe('abc');
  });

  it('updates text raw field', async () => {
    expect.assertions(2);
    wrapper = mount(PopupNode, {
      propsData: { node: { type: 'text', text: 'test' } },
    });
    expect(rawValue(wrapper)).toBe('test');
    await enterText(wrapper, 'abc', 'textarea');
    expect(rawValue(wrapper)).toBe('abc');
  });

  it('ignores invalid values in other fields', async () => {
    expect.assertions(3);
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'element',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    const inputs = wrapper.findAll('input');
    await enterText(wrapper, 'abc&', inputs.at(0));
    expect(rawValue(wrapper)).toBe('<test ta="abc"/>');
    await enterText(wrapper, 'def&', inputs.at(1));
    expect(rawValue(wrapper)).toBe('<test ta="abc"/>');
    await enterText(wrapper, 'ghi&', inputs.at(2));
    expect(rawValue(wrapper)).toBe('<test ta="abc"/>');
  });

  it('handles invalid XML input', async () => {
    expect.assertions(4);
    wrapper = mount(PopupNode, {
      propsData: {
        node: {
          type: 'element',
          name: 'test',
          attributes: [{ name: 'ta', value: 'abc' }],
        },
      },
    });
    await enterRawXml(wrapper, '<a a="/>');
    expect(wrapper.find('.g8--error').exists()).toBe(true);
    const inputs = wrapper.findAll('input');
    expect((inputs.at(0).element as HTMLInputElement).value).toBe('test');
    expect((inputs.at(1).element as HTMLInputElement).value).toBe('ta');
    expect((inputs.at(2).element as HTMLInputElement).value).toBe('abc');
  });
});
