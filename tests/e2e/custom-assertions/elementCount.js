/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * A custom Nightwatch assertion. The assertion name is the filename.
 *
 * Example usage:
 *   browser.assert.elementCount(selector, count)
 *
 * For more information on custom assertions see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions
 *
 *
 * @param {string|object} selectorOrObject
 * @param {number} count
 */

exports.assertion = function elementCount(selectorOrObject, count, msg) {
  // If the custom commands operates with DOM elements, this options should be set
  this.options = {
    elementSelector: true,
  };

  // it's an object when called from a page object element or section
  const selector =
    'string' == typeof selectorOrObject
      ? selectorOrObject
      : selectorOrObject.selector;

  let found = 0;

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
      msg = `Testing if %s ${
        this.negate ? "hasn't" : 'has'
      } element count of %s`;
    }
    return {
      message: msg,
      args: [this.elementSelector, count],
    };
  };

  /**
   * Returns the expected value of the assertion which is displayed in the case
   * of a failure
   *
   * @return {string}
   */
  this.expected = function() {
    return `element count ${this.negate ? "isn't" : 'is'} ${count}`;
  };

  /**
   * Called with the result object of the command to retrieve the value which
   * is to be evaluated
   *
   * @param {Object} result
   * @return {*}
   */
  this.value = result => (found = result);

  /**
   * Given the value, the condition used to evaluate if the assertion is passed
   * @param {*} value
   * @return {Boolean}
   */
  this.evaluate = value => value == count;

  /**
   * When defined, this method is called by the assertion runner with the
   * command result to determine the actual state of the assertion in the event
   * of a failure
   *
   * @param {Boolean} passed
   * @return {string}
   */
  this.actual = passed => `element count is ${passed ? count : found}`;

  /**
   * The command which is to be executed by the assertion runner; Nightwatch
   * api is available as `this.api`
   * @param {function} cb
   */
  this.command = function(cb) {
    this.api.elements('css selector', selector, res => cb(res.value.length));
  };
};
