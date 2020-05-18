/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.command = function savePopup() {
  this.click('.g8-xml__popup__footer button:last-of-type');
  this.waitForElementNotPresent('.g8-xml__popup');
  return this;
};
