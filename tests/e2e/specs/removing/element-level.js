/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.rootElement();
    page.waitForElementVisible('@root');
    page.expandNode('@root');
  },

  afterEach: browser => browser.end(),

  'Remove comment': () => {
    page.menuRemove('@comment');
    page.assert.not.outputContains('<!-- xslplane.2.xml -->');
  },

  'Remove CDATA': () => {
    page.menuRemove('@cdata');
    page.assert.not.outputContains('<![CDATA[<sender>John Smith</sender>]]>');
  },

  'Remove text': () => {
    page.expandNode('@model');
    page.menuRemove('@skyhawk');
    page.assert.not.outputContains('Skyhawk');
  },

  'Remove element': () => {
    page.menuRemove('@year');
    page.assert.not.outputContains('year');
    page.assert.not.outputContains('1977');
  },
};
