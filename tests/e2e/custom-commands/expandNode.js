/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.command = function expandNode(selector) {
  selector = require('../utils').selectorString(selector);
  this.click(`${selector} .g8-tree__node__entry`);
  this.waitForElementVisible(`${selector} .g8-tree__branch`);
  return this;
};
