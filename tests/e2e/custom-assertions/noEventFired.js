/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.assertion = function eventFired(msg) {
  // noinspection JSUnusedGlobalSymbols
  this.formatMessage = function() {
    if (!msg) {
      msg = `Testing if ${this.negate ? 'an' : 'no'} event was fired`;
    }
    return { message: msg };
  };

  // noinspection JSUnusedGlobalSymbols
  this.expected = function() {
    return `${this.negate ? 'an' : 'no'} event was fired`;
  };

  // noinspection JSUnusedGlobalSymbols
  this.evaluate = value => '' === value;

  // noinspection JSUnusedGlobalSymbols
  this.command = function(callback) {
    this.api.getText('#event-name', r => callback(r));
  };
};
