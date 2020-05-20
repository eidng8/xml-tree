/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.popup();
    page.waitForElementVisible('@tree');
    page.menuEdit('@doctype');
  },

  afterEach: browser => browser.end(),

  'Edit doctype': () => {
    page.setValue('@textarea', 'note SYSTEM "note.dtd"');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('note SYSTEM \\"note.dtd\\"');
    page.assert.outputContains('<!DOCTYPE note SYSTEM "note.dtd">');
    page.assert.containsText('@doctype', 'note SYSTEM "note.dtd"');
  },

  'Edit raw doctype': () => {
    page.enterText('@raw', '<!DOCTYPE note SYSTEM "note.dtd">');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('note SYSTEM \\"note.dtd\\"');
    page.assert.outputContains('<!DOCTYPE note SYSTEM "note.dtd">');
    page.assert.containsText('@doctype', 'note SYSTEM "note.dtd"');
  },

  'Forbids saving invalid XML': () => {
    page.setValue('@raw', '>');
    page.savePopup(true);
    page.assert.noEventFired();
    page.assert.visible('@popup');
    page.assert.visible('@error');
    page.assert.visible('@message');
  },

  'Cancel editing': () => {
    page.setValue('@textarea', 'note SYSTEM "note.dtd"');
    page.cancelPopup();
    page.assert.noEventFired();
    page.assert.not.outputContains('<!DOCTYPE note SYSTEM "note.dtd">');
  },
};
