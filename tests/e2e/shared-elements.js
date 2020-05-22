/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  app: '#app',
  tree: '.g8-xml__tree',
  output: '#app>pre.xml',
  nodes: '.g8-tree__node',
  popup: '.g8-xml__popup',
  error: '.g8--error',
  message: '.g8-xml__popup__message',
  declaration: { selector: '.g8-tree__node', index: 0 },

  tagName: '.g8-xml__popup__control-group input',
  attrName: '.g8-xml__popup__attribute .g8-xml__popup__control-label input',
  attrValue: '.g8-xml__popup__attribute .g8-xml__popup__control input',
  attrButton:
    '.g8-xml__popup__attribute .g8-xml__popup__control__accessories button',
  addAttr: '.g8-xml__popup__attributes+.g8-xml__popup__control-group button',
  textarea: '.g8-xml__popup__body textarea',
  raw: '.g8-xml__popup__raw textarea',
};
