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
    page.expandNode('@model');
    page.menuEdit('@skyhawk');
  },

  afterEach: browser => browser.end(),

  'Edit text': () => {
    page.setValue('@textarea', 'test text');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test text');
    page.assert.outputContains('test text');
    page.assert.containsText('@skyhawk', 'test text');
  },

  'Edit raw text': () => {
    page.enterText('@raw', 'test text');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test text');
    page.assert.outputContains('test text');
    page.assert.containsText('@skyhawk', 'test text');
  },

  'Forbids saving invalid XML': () => {
    page.setValue('@raw', '<');
    page.savePopup(true);
    page.assert.noEventFired();
    page.assert.visible('@popup');
    page.assert.visible('@error');
    page.assert.visible('@message');
  },

  'Cancel editing': () => {
    page.setValue('@textarea', 'test text');
    page.cancelPopup();
    page.assert.noEventFired();
    page.assert.not.outputContains('test text');
  },
};
