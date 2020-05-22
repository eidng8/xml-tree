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
    page.click('#pi-attr');
    page.menuEdit('@instruction');
  },

  afterEach: browser => browser.end(),

  'Edit instruction name': () => {
    page.enterText('@tagName', 'test-tag');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test-tag');
    page.assert.outputContains(
      '<?test-tag type="text/xsl" href="xslplane.1.xsl" ?>',
    );
    page.assert.containsText('@instruction', 'test-tag');
  },

  'Edit instruction': () => {
    page.setValue('@textarea', 'test test');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('"instruction": "test test"');
    page.assert.outputContains('<?xml-stylesheet test test?>');
    page.assert.containsText('@instruction', 'xml-stylesheet test test');
  },

  'Edit raw instruction': () => {
    page.enterText('@raw', '<?test something?>');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('"name": "test"');
    page.assert.eventContains('"instruction": "something"');
    page.assert.outputContains('<?test something?>');
    page.assert.containsText('@instruction', 'test something');
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
    page.enterText('@tagName', 'test-tag');
    page.cancelPopup();
    page.assert.not.eventFired('node-changed');
    page.assert.not.outputContains('test-tag');
  },
};
