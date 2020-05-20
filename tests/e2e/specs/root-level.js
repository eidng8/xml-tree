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

  'DOCTYPE menu': () => {
    page.section.tree.menuOn('@doctype');
    page.assert.menuHasEdit();
    page.assert.menuHasRemove();
    page.assert.menuHasInsertAfter();
    page.assert.menuHasInsertBefore();
    page.assert.not.menuHasAppend();
    page.assert.not.menuHasPrepend();
  },

  'Comment menu': () => {
    page.section.tree.menuOn('@comment');
    page.assert.menuHasEdit();
    page.assert.menuHasRemove();
    page.assert.menuHasInsertAfter();
    page.assert.menuHasInsertBefore();
    page.assert.not.menuHasAppend();
    page.assert.not.menuHasPrepend();
  },

  'Instruction menu': () => {
    page.section.tree.menuOn('@instruction');
    page.assert.menuHasEdit();
    page.assert.menuHasRemove();
    page.assert.menuHasInsertAfter();
    page.assert.menuHasInsertBefore();
    page.assert.not.menuHasAppend();
    page.assert.not.menuHasPrepend();
  },

  'Element menu': () => {
    page.section.tree.menuOn('@element');
    page.assert.menuHasEdit();
    page.assert.menuHasInsertAfter();
    page.assert.menuHasInsertBefore();
    page.assert.menuHasAppend();
    page.assert.menuHasPrepend();
    page.assert.not.menuHasRemove();
  },

  'Root level insert after': () => {
    page.section.tree.menuInsertAfter('@doctype', undefined, true);
    page.assert.menuHasInsertAfter(
      'cdata',
      'comment',
      'doctype',
      'instruction',
    );
  },

  'Root level insert before': () => {
    page.section.tree.menuInsertBefore('@doctype', undefined, true);
    page.assert.menuHasInsertBefore(
      'cdata',
      'comment',
      'doctype',
      'instruction',
    );
  },

  'Root level append': () => {
    page.section.tree.menuAppend('@element', undefined, true);
    page.assert.menuHasAppend(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },

  'Root level prepend': () => {
    page.section.tree.menuPrepend('@element', undefined, true);
    page.assert.menuHasPrepend(
      'cdata',
      'comment',
      'element',
      'instruction',
      'text',
    );
  },
};
