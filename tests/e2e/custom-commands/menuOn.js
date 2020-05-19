/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const selectorString = require('../utils').selectorString;

exports.command = function menuOn(selector) {
  selector = `${selectorString(selector)} .g8-tree__node__entry__label>span`;
  this.moveToElement(selector, 1, 1);
  this.mouseButtonClick('right');
  this.waitForElementVisible('.g8-menu');
  return this;
};
