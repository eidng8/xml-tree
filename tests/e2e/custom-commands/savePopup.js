/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.command = function savePopup(dontWait) {
  // Other Nightwatch commands are available via "this"
  this.click('.g8-xml__popup__footer button:first-of-type');
  if (!dontWait) this.waitForElementNotPresent('.g8-xml__popup');
  return this;
};
