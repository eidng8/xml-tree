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
    page.menuEdit('@cdata');
  },

  afterEach: browser => browser.end(),

  'Edit cdata': () => {
    page.setValue('@textarea', 'test cdata');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test cdata');
    page.assert.outputContains('<![CDATA[test cdata]]>');
    page.assert.containsText('@cdata', 'test cdata');
  },

  'Edit raw cdata': () => {
    page.enterText('@raw', '<![CDATA[test cdata]]>');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test cdata');
    page.assert.outputContains('<![CDATA[test cdata]]>');
    page.assert.containsText('@cdata', 'test cdata');
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
    page.setValue('@textarea', 'test cdata');
    page.cancelPopup();
    page.assert.not.eventFired('node-changed');
    page.assert.not.outputContains('test cdata');
  },
};
