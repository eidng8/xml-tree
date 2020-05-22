/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const _ = require('lodash');
const root = '.g8-xml__tree>.g8-tree__node:last-child';
const elements = {};

_.each(['cdata', 'comment', 'year', 'make', 'model', 'color'], (e, i) => {
  elements[e] = `${root} .g8-tree__node:nth-child(${i + 1})`;
});
elements.skyhawk = `${root} .g8-tree__node:nth-child(5) .g8-tree__node`;

module.exports = {
  url: '/',
  elements: [require('../shared-elements'), { root, ...elements }],
};
