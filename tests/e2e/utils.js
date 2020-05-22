/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const _ = require('lodash');

module.exports = {
  /**
   * @param {string | object} selector
   * @return {string}
   */
  selectorString(selector) {
    if ('string' == typeof selector) return selector;
    let sel = selector.selector;
    if (!isNaN(selector.index)) {
      sel = `${sel}:nth-child(${selector.index + 1})`;
    }
    return sel;
  },

  /**
   * Take menu action.
   * @param {string} id menu item ID
   * @return {Function}
   */
  menuAction(id) {
    return function(selector, sub, dontWait) {
      this.menuOn(selector);
      this.click(`#${id}`);
      if (sub) {
        this.waitForElementVisible('.g8-menu--can__go-back');
        this.click(`#${id}-${sub}`);
      }
      if (!dontWait) this.waitForElementVisible('.g8-xml__popup');
      return this;
    };
  },

  /**
   * Asserts menu existence.
   * @param {string} id
   * @param {string} label
   * @return {Function}
   */
  menuAssertion(id, label) {
    return function(...sub) {
      // noinspection JSUnusedGlobalSymbols
      this.formatMessage = function() {
        return {
          message:
            sub && sub.length
              ? `Testing if menu '${label}' ${
                  this.negate ? "doesn't have" : 'has'
                } [${sub.join(', ')}]`
              : `Testing if menu ${
                  this.negate ? "doesn't have" : 'has'
                } '${label}'`,
        };
      };

      // noinspection JSUnusedGlobalSymbols
      this.expected = function() {
        return sub && sub.length
          ? `menu '${label}' ${
              this.negate ? "doesn't have" : 'has'
            } [${sub.join(', ')}]`
          : `menu ${this.negate ? "doesn't have" : 'has'} '${label}'`;
      };

      // noinspection JSUnusedGlobalSymbols
      this.evaluate = value => (sub && sub.length ? sub.length : 1) == value;

      // noinspection JSUnusedGlobalSymbols
      this.actual = passed => {
        const m = passed ? 'has' : "doesn't have";
        return sub && sub.length
          ? `${m} [${sub.join(', ')}]`
          : `${m} '${label}'`;
      };

      // noinspection JSUnusedGlobalSymbols
      this.command = function(cb) {
        let sel;
        if (sub && sub.length) {
          sel = _.map(sub, s => `#${id}-${s}`).join(',');
        } else {
          sel = `#${id}`;
        }
        this.api.elements('css selector', sel, res =>
          cb({ value: res.value.length }),
        );
      };
    };
  },
};
