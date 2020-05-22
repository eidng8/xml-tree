/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const _ = require('lodash');
const elements = {};

// root level nodes
_.each(['doctype', 'comment', 'instruction'], (e, i) => {
  elements[e] = `.g8-xml__tree>.g8-tree__node:nth-child(${i + 2})`;
});

// nodes under root element
const root = '.g8-xml__tree>.g8-tree__node:last-child';
_.each(['cdata', 'comment', 'year', 'make', 'model', 'color'], (e, i) => {
  elements[e] = `${root} .g8-tree__node:nth-child(${i + 1})`;
});
elements.skyhawk = `${root} .g8-tree__node:nth-child(5) .g8-tree__node`;

module.exports = {
  url: '/',
  elements: [require('../shared-elements'), { root, ...elements }],
};
