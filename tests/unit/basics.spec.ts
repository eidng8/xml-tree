/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import { expandTreeNode } from './helpers';

const xml =
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<!DOCTYPE note [\n' +
  '  <!ELEMENT note    (to,from,heading,body)>\n' +
  '  <!ELEMENT to      (#PCDATA)>\n' +
  '  <!ELEMENT from    (#PCDATA)>\n' +
  '  <!ELEMENT heading (#PCDATA)>\n' +
  '  <!ELEMENT body    (#PCDATA)>\n' +
  ']>' +
  // '<!DOCTYPE note SYSTEM "note.dtd">' +
  '<!-- xslplane.1.xml -->\n' +
  '<?xml-stylesheet type="text/xsl" href="xslplane.1.xsl" ?>\n' +
  '<plane xmlns="urn:xxx" xmlns:y="urn:yyy">\n' +
  '  <![CDATA[<sender>John Smith</sender>]]>\n' +
  '  <!-- xslplane.2.xml -->\n' +
  '  <year> 1977 </year>\n' +
  '  <y:make> <c>Cessna</c><c></c><c></c> </y:make>\n' +
  '  <model>\n' +
  '    Skyhawk\n' +
  '  </model>\n' +
  '  <color> Light&nbsp;blue and white </color>\n' +
  '</plane>';

describe('XML view', () => {
  let propsData: any;

  beforeEach(() => (propsData = { xml }));

  it('shows tree view', async () => {
    expect.assertions(2);
    const wrapper = mount(G8XmlEdit, { propsData });
    expect(wrapper.find('.g8-tree__view').exists()).toBe(true);
    await expandTreeNode(wrapper, '.g8-tree__node:last-child');
    expect(wrapper.findAll('.g8-tree__node').length).toBe(11);
  });

  it('always show declaration attribute values', () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData });
    const tags = '.g8-tree__node:first-child .g8-tree__node__entry__tags__tag';
    expect(wrapper.find(tags).text()).toContain('=');
  });

  it('defaults to hide attribute values', () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData });
    const tags =
      '.g8-tree__node:nth-child(n+2) .g8-tree__node__entry__tags__tag';
    expect(wrapper.find(tags).text()).not.toContain('=');
  });

  it('can show attribute values', () => {
    expect.assertions(1);
    propsData.showAttrValue = true;
    const wrapper = mount(G8XmlEdit, { propsData });
    const tags =
      '.g8-tree__node:nth-child(n+2) .g8-tree__node__entry__tags__tag';
    expect(wrapper.find(tags).text()).toContain('=');
  });

  describe('Declarations', () => {
    it('fills in default declaration', () => {
      expect.assertions(2);
      const wrapper = mount(G8XmlEdit, { propsData: { xml: '<a/>' } });
      expect(
        wrapper
          .find('.g8-tree__node:first-child .g8-xml__declaration')
          .exists(),
      ).toBe(true);
      const tags = wrapper.findAll(
        '.g8-xml__declaration~.g8-tree__node__entry__tags__tag',
      );
      expect(tags.length).toBe(3);
    });
  });

  describe('Processing instruction', () => {
    const node = '.g8-tree__view .g8-tree__node:nth-child(4)';
    const tags = `${node} .g8-tree__node__entry__tags .g8-tree__node__entry__tags__tag`;

    it('defaults to treat processing instruction as text', () => {
      expect.assertions(1);
      const wrapper = mount(G8XmlEdit, { propsData });
      expect(wrapper.find(tags).exists()).toBe(false);
    });

    it('supports processing instruction attribute', () => {
      expect.assertions(2);
      propsData.piUseAttribute = true;
      const wrapper = mount(G8XmlEdit, { propsData });
      expect(wrapper.find(tags).exists()).toBe(true);
      expect(wrapper.findAll(tags).length).toBe(2);
    });
  });
});
