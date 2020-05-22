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

  'Insert CDATA': () => {
    page.section.tree.menuInsertAfter('@element', 'cdata');
    page.savePopup();
    page.assert.outputContains('<![CDATA[new cdata]]>');
    page.assert.containsText('.g8-tree__node:last-child', 'new cdata');
  },

  'Insert comment': () => {
    page.section.tree.menuInsertAfter('@element', 'comment');
    page.savePopup();
    page.assert.outputContains('<!--new comment-->');
    page.assert.containsText('.g8-tree__node:last-child', 'new comment');
  },

  'Insert DOCTYPE': () => {
    page.section.tree.menuInsertBefore('@element', 'doctype');
    page.savePopup();
    page.assert.outputContains('<!DOCTYPE new doctype>');
    page.section.tree.assert.containsText('@element', 'new doctype');
  },

  'Insert instruction': () => {
    page.section.tree.menuInsertBefore('@element', 'instruction');
    page.savePopup();
    page.assert.outputContains('<?new-instruction?>');
    page.section.tree.assert.containsText('@element', 'new-instruction');
  },
};
