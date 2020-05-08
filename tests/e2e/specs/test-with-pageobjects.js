/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  beforeEach: browser => browser.init(),

  'e2e tests using page objects': browser => {
    const homepage = browser.page.homepage();
    homepage.waitForElementVisible('@appContainer');

    const app = homepage.section.xml;
    app.assert.elementCount('@nodes', 5);
    app.expect.section('@declaration').to.be.visible;
    app.expect.section('@declaration').text.to.match(/version="1\.0"/);

    browser.end();
  },
};
