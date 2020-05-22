/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  url: '/',
  elements: require('../shared-elements'),
  sections: {
    tree: {
      selector: '.g8-xml__tree',
      elements: {
        doctype: { selector: '.g8-tree__node', index: 1 },
        comment: { selector: '.g8-tree__node', index: 2 },
        instruction: { selector: '.g8-tree__node', index: 3 },
        element: { selector: '.g8-tree__node', index: 4 },
      },
    },
  },
};
