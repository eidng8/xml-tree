/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

exports.assertion = function(selector, search, msg) {
  selector = require('../utils').selectorString(selector);

  let text = '';

  // If the custom commands operates with DOM elements, this options should be set
  this.options = {
    elementSelector: true,
  };

  /**
   * Returns the message format which will be used to output the message in the
   * console and also the arguments which will be used for replace the place
   * holders, used in the order of appearance
   *
   * The message format also takes into account whether the `.not` negate has
   * been used
   *
   * @return {{args: [], message: string}}
   */
  this.formatMessage = function() {
    if (!msg) {
      if (search instanceof RegExp) {
        msg = `Testing if %s label ${
          this.negate ? "doesn't match" : 'matches'
        } %s`;
      } else {
        msg = `Testing if %s label ${
          this.negate ? "doesn't contain" : 'contains'
        } %s`;
      }
    }

    return {
      message: msg,
      args: [
        this.elementSelector,
        search instanceof RegExp ? search.toString() : `'${search}'`,
      ],
    };
  };

  /**
   * Returns the expected value of the assertion which is displayed in the case
   * of a failure
   *
   * @return {string}
   */
  this.expected = function() {
    if (search instanceof RegExp) {
      return (
        `'${text}' ` +
        (this.negate ? `doesn't match '${search}'` : `matches '${search}'`)
      );
    }
    return (
      `'${text}' ` +
      (this.negate ? `doesn't contain '${search}'` : `contains '${search}'`)
    );
  };

  /**
   * Given the value, the condition used to evaluate if the assertion is passed
   * @param {*} value
   * @return {Boolean}
   */
  this.evaluate = function(value) {
    if (typeof value != 'string') return false;
    if (search instanceof RegExp) return search.test(value);
    return value.includes(search);
  };

  /**
   * Called with the result object of the command to retrieve the value which
   * is to be evaluated
   *
   * @param {Object} result
   * @return {*}
   */
  this.value = function(result) {
    return result.value;
  };

  /**
   * When defined, this method is called by the assertion runner with the
   * command result, to determine if the value can be retrieved successfully
   * from the result object
   *
   * @param result
   * @return {boolean|*}
   */
  this.failure = function(result) {
    return false === result || (result && -1 === result.status);
  };

  /**
   * When defined, this method is called by the assertion runner with the
   * command result to determine the actual state of the assertion in the event
   * of a failure
   *
   * @param {Boolean} passed
   * @return {string}
   */
  this.actual = function(passed) {
    if (search instanceof RegExp) {
      return `'${text}' ${passed ? 'matches' : "doesn't match"} '${search}'`;
    }
    return `'${text}' ${passed ? 'contains' : "doesn't contain"} '${search}'`;
  };

  /**
   * The command which is to be executed by the assertion runner; Nightwatch
   * api is available as `this.api`
   * @param {function} callback
   */
  this.command = function(callback) {
    this.api.getText(selector, r => {
      text = r.value;
      callback(r);
    });
  };
};
