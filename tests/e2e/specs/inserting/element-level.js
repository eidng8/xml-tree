/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

const root = '.g8-xml__tree>.g8-tree__node:last-child';

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.rootElement();
    page.waitForElementVisible('@root');
    page.expandNode('@root');
  },

  afterEach: browser => browser.end(),

  'Append CDATA': () => {
    page.menuAppend('@root', 'cdata');
    page.savePopup();
    page.assert.outputContains('<![CDATA[new cdata]]>');
    page.assert.containsText(`${root} .g8-tree__node:last-child`, 'new cdata');
  },

  'Prepend comment': () => {
    page.menuPrepend('@root', 'comment');
    page.savePopup();
    page.assert.outputContains('<!--new comment-->');
    page.assert.containsText(
      `${root} .g8-tree__node:first-child`,
      'new comment',
    );
  },

  'Append text': () => {
    page.menuAppend('@root', 'text');
    page.savePopup();
    page.assert.outputContains('new text');
    page.assert.containsText(`${root} .g8-tree__node:last-child`, 'new text');
  },

  'Prepend instruction': () => {
    page.menuPrepend('@root', 'instruction');
    page.savePopup();
    page.assert.outputContains('<?new-instruction?>');
    page.assert.containsText(
      `${root} .g8-tree__node:first-child`,
      'new-instruction',
    );
  },

  'Append element': () => {
    page.menuAppend('@root', 'element');
    page.savePopup();
    page.assert.outputContains('<new-element/>');
    page.assert.containsText(
      `${root} .g8-tree__node:last-child`,
      'new-element',
    );
  },
};
