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
    page.expandNode('@root');
    page.menuEdit('@comment');
  },

  afterEach: browser => browser.end(),

  'Edit comment': () => {
    page.setValue('@textarea', 'test comment');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test comment');
    page.assert.outputContains('<!--test comment-->');
    page.assert.containsText('@comment', 'test comment');
  },

  'Edit raw comment': () => {
    page.enterText('@raw', '<!-- test comment -->');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test comment');
    page.assert.outputContains('<!-- test comment -->');
    page.assert.containsText('@comment', 'test comment');
  },

  'Forbids saving invalid XML': () => {
    page.setValue('@raw', '>');
    page.savePopup(true);
    page.assert.not.eventFired('node-changed');
    page.assert.visible('@popup');
    page.assert.visible('@error');
    page.assert.visible('@message');
  },

  'Cancel editing': () => {
    page.setValue('@textarea', 'test comment');
    page.cancelPopup();
    page.assert.not.eventFired('node-changed');
    page.assert.not.outputContains('test comment');
  },
};
