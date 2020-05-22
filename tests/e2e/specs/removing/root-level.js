/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.rootLevel();
    page.waitForElementVisible('@tree');
  },

  afterEach: browser => browser.end(),

  'Remove DOCTYPE': () => {
    page.section.tree.menuRemove('@doctype');
    page.assert.not.outputContains('DOCTYPE');
  },

  'Remove Comment': () => {
    page.section.tree.menuRemove('@comment');
    page.assert.not.outputContains('<!-- xslplane.1.xml -->');
  },

  'Remove Instruction': () => {
    page.section.tree.menuRemove('@instruction');
    page.assert.not.outputContains('<?xml-stylesheet');
  },
};
