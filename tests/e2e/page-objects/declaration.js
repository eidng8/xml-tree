/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const sharedElements = require('../shared-elements');

module.exports = {
  url: '/',
  elements: [
    sharedElements,
    {
      declaration: '.g8-tree__node:first-child',
      popup: '.g8-xml__popup',
    },
  ],
  commands: {
    edit() {
      this.moveToElement('@declaration', 1, 1);
      this.api.mouseButtonClick('right');
      this.waitForElementVisible('@popup');
    },
    /**
     * @param {"1.0"|"1.1"} version
     */
    setVersion(version) {
      this.api.click(
        `.g8-xml__popup__attribute:first-child option[value="${version}"]`,
      );
    },
    /**
     * @param {"yes"|"no"} version
     */
    setStandalone(version) {
      this.api.click(
        `.g8-xml__popup__attribute:last-child option[value="${version}"]`,
      );
    },
    /**
     * @param {string} encoding
     */
    setEncoding(encoding) {
      this.api.click('.g8-xml__popup__attribute input');
      this.setValue('.g8-xml__popup__attribute input', encoding);
    },
  },
};
