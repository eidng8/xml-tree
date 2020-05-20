/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  screenshots: {
    enabled: !process.env.CI,
    path: './tests/e2e/reports',
    on_failure: true,
    on_error: true,
  },
};
