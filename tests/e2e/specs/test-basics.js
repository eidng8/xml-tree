/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

let page;

module.exports = {
  beforeEach: browser => {
    browser.init();
    page = browser.page.homepage();
    page.waitForElementVisible('@app');
  },

  afterEach: browser => browser.end(),

  'XML tree': () => {
    page.assert.elementCount('@nodes', 5);
  },

  'XML output': () => {
    page.assert.containsText(
      '@output',
      '<?xml version="1.0" encoding="utf-8"?>',
    );
  },
};
