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

  'Turn off attribute value display': () => {
    page.click('#show-attr-value');
    page.assert.not.containsText(
      '.g8-tree__node:not(:first-child) .g8-tree__node__entry__tags__tag',
      '=',
    );
  },

  'Turn off dark theme': () => {
    page.assert.cssProperty(
      '.g8-tree__node__entry__tags__tag',
      'background-color',
      'rgba(38, 38, 38, 1)',
    );
    page.click('#dark-theme');
    page.assert.cssProperty(
      '.g8-tree__node__entry__tags__tag',
      'background-color',
      'rgba(204, 204, 204, 1)',
    );
  },
};
