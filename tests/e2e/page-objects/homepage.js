/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * A Nightwatch page object. The page object name is the filename.
 *
 * Example usage:
 *   browser.page.homepage.navigate()
 *
 * For more information on working with page objects see:
 *   https://nightwatchjs.org/guide/working-with-page-objects/
 *
 */

module.exports = {
  url: '/',
  commands: [],

  // A page object can have elements
  elements: {
    appContainer: '#app',
  },

  // Or a page objects can also have sections
  sections: {
    xml: {
      selector: '.g8-xml__container',

      elements: {
        tree: '.g8-xml__tree',
        nodes: '.g8-tree__node',
      },

      // - a page object section can also have sub-sections
      // - elements or sub-sections located here are retrieved using the "app" section as the base
      sections: {
        declaration: {
          selector: 'li:first-child',
        },

        nodes: {
          // the equivalent css selector for the "welcome" sub-section would be:
          //  '#app div.hello'
          selector: 'li:nth-child(n+2)',

          elements: {
            doctype: {
              selector: '.g8-tree__node',
              index: 0,
            },
          },
        },
      },
    },
  },
};
