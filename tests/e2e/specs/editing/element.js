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
    page.menuEdit('@root');
  },

  afterEach: browser => browser.end(),

  'Edit tag name': () => {
    page.enterText('@tagName', 'test-tag');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test-tag');
    page.assert.outputContains('<test-tag xmlns="urn:xxx" xmlns:y="urn:yyy">');
    page.assert.containsText('@root', 'test-tag');
  },

  'Edit attribute name': () => {
    page.enterText('@attrName', 'test-attr');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test-attr');
    page.assert.outputContains('<plane test-attr="urn:xxx" xmlns:y="urn:yyy">');
    page.assert.containsText('@root', 'test-attr="urn:xxx"');
  },

  'Edit attribute value': () => {
    page.setValue('@attrValue', 'test-value');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test-value');
    page.assert.outputContains('<plane xmlns="test-value" xmlns:y="urn:yyy">');
    page.assert.containsText('@root', 'xmlns="test-value"');
  },

  'Delete attribute': () => {
    page.click('@attrButton');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.not.eventContains('urn:xxx');
    page.assert.outputContains('<plane xmlns:y="urn:yyy">');
    page.assert.not.containsText('@root', 'text/xsl');
  },

  'Add attribute': browser => {
    page.click('@addAttr');
    browser
      .keys('a')
      .keys('\t')
      .keys('b');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.not.eventContains('a=\\"b\\"');
    page.assert.outputContains(
      '<plane xmlns="urn:xxx" xmlns:y="urn:yyy" a="b">',
    );
    page.assert.containsText('@root', 'a="b"');
  },

  'Edit raw element': () => {
    page.enterText('@raw', '<test a="b"/>');
    page.savePopup();
    page.assert.eventFired('node-changed');
    page.assert.eventContains('test');
    page.assert.outputContains('<test a="b">');
    page.assert.containsOrMatches('@root', /test\s+a="b"/);
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
    page.setValue('@raw', '<test a="b"/>');
    page.cancelPopup();
    page.assert.noEventFired();
    page.assert.not.outputContains('<test a="b">');
  },
};
