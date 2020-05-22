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

  'Element level insert after': () => {
    page.menuInsertAfter('@comment', undefined, true);
    page.assert.menuHasInsertAfter(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },

  'Element level insert before': () => {
    page.menuInsertBefore('@cdata', undefined, true);
    page.assert.menuHasInsertBefore(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },

  'Element level insert after (last sibling is text)': () => {
    page.expandNode('@model');
    page.menuInsertAfter('@skyhawk', undefined, true);
    page.assert.menuHasInsertAfter(
      'cdata',
      'comment',
      'element',
      'instruction',
    );
  },

  'Element level insert before (first sibling is text)': () => {
    page.expandNode('@model');
    page.menuInsertBefore('@skyhawk', undefined, true);
    page.assert.menuHasInsertBefore(
      'cdata',
      'comment',
      'element',
      'instruction',
    );
  },

  'Element level append': () => {
    page.menuAppend('@make', undefined, true);
    page.assert.menuHasAppend(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },

  'Element level prepend': () => {
    page.menuPrepend('@make', undefined, true);
    page.assert.menuHasPrepend(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },

  'Element level append (last child is text)': () => {
    page.menuAppend('@model', undefined, true);
    page.assert.menuHasAppend('cdata', 'comment', 'element', 'instruction');
  },

  'Element level prepend (first child is text)': () => {
    page.menuPrepend('@year', undefined, true);
    page.assert.menuHasPrepend('cdata', 'comment', 'element', 'instruction');
  },
};
