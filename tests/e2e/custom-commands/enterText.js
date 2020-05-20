/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.command = function enterText(selector, text) {
  selector = require('../utils').selectorString(selector);
  this.click(selector);
  this.setValue(selector, text);
  return this;
};
