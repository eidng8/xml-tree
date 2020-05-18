/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.assertion = function outputContains(search, msg) {
  let got = '';

  // noinspection JSUnusedGlobalSymbols
  this.formatMessage = function() {
    if (!msg) {
      if (search instanceof RegExp) {
        msg = `Testing if event ${
          this.negate ? "doesn't match" : 'matches'
        } %s`;
      } else {
        msg = `Testing if event ${
          this.negate ? "doesn't contain" : 'contains'
        } %s`;
      }
    }
    return {
      message: msg,
      args: [search instanceof RegExp ? search.toString() : `'${search}'`],
    };
  };

  // noinspection JSUnusedGlobalSymbols
  this.expected = function() {
    if (search instanceof RegExp) {
      return (
        `'${got}' ` +
        (this.negate ? `doesn't match '${search}'` : `matches '${search}'`)
      );
    }
    return (
      `'${got}' ` +
      (this.negate ? `doesn't contain '${search}'` : `contains '${search}'`)
    );
  };

  // noinspection JSUnusedGlobalSymbols
  this.evaluate = value => {
    if (typeof value != 'string') return false;
    if (search instanceof RegExp) return search.test(value);
    return value.includes(search);
  };

  // noinspection JSUnusedGlobalSymbols
  this.actual = passed => {
    if (search instanceof RegExp) {
      return `'${got}' ${passed ? 'matches' : "doesn't match"} '${search}'`;
    }
    return `'${got}' ${passed ? 'contains' : "doesn't contain"} '${search}'`;
  };

  // noinspection JSUnusedGlobalSymbols
  this.command = function(callback) {
    this.api.getText('#event>code:last-child', r => {
      got = r.value;
      callback(r);
    });
  };
};
