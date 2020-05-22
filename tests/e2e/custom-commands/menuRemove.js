/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.command = function menuRemove(selector) {
  this.menuOn(selector);
  this.click('#g8-xml-menu-remove');
  this.waitForElementPresent('.g8-menu--off');
  return this;
};
