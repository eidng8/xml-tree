/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.declaration();
    page.waitForElementVisible('@declaration');
  },

  afterEach: browser => browser.end(),

  'declaration node': () => {
    page.assert.containsText('@declaration', 'version="1.0"');
    page.assert.outputContains('encoding="utf-8"');
  },

  'change declaration version': () => {
    page.edit();
    page.setVersion('1.1');
    page.savePopup();
    page.assert.containsText('@declaration', 'version="1.1"');
    page.assert.outputContains('version="1.1"');
    page.assert.eventFired('declaration-changed');
    page.assert.eventContains('{ "name": "version", "value": "1.1" }');
  },

  'change declaration encoding': () => {
    page.edit();
    page.setEncoding('ascii');
    page.savePopup();
    page.assert.containsText('@declaration', 'encoding="ascii"');
    page.assert.outputContains('encoding="ascii"');
    page.assert.eventFired('declaration-changed');
    page.assert.eventContains('{ "name": "encoding", "value": "ascii" }');
  },

  'change declaration standalone': () => {
    page.edit();
    page.setStandalone('yes');
    page.savePopup();
    page.assert.containsText('@declaration', 'standalone="yes"');
    page.assert.outputContains('standalone="yes"');
    page.assert.eventFired('declaration-changed');
    page.assert.eventContains('{ "name": "standalone", "value": "yes" }');
  },

  'cancel declaration change': () => {
    page.edit();
    page.setEncoding('ascii');
    page.cancelPopup();
    page.assert.containsText('@declaration', 'encoding="utf-8"');
    page.assert.outputContains('encoding="utf-8"');
    page.assert.noEventFired();
  },
};
