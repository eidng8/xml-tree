/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.assertion = function eventFired(event, msg) {
  // noinspection JSUnusedGlobalSymbols
  this.formatMessage = function() {
    if (!msg) {
      msg = `Testing if event %s was${this.negate ? "n't" : ''} fired`;
    }

    return {
      message: msg,
      args: [`'${event}'`],
    };
  };

  // noinspection JSUnusedGlobalSymbols
  this.expected = function() {
    return this.negate ? "wasn't fired" : 'was fired';
  };

  // noinspection JSUnusedGlobalSymbols
  this.evaluate = value => value == event;

  // noinspection JSUnusedGlobalSymbols
  this.command = function(callback) {
    this.api.getText('#event-name', r => callback(r));
  };
};
