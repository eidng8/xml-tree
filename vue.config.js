/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const WBA = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: config => {
    if ('production' == process.env.NODE_ENV) {
      config.devtool = undefined;
    }
    if (process.env.WBA) {
      config.plugins.push(new WBA({ analyzerMode: 'static' }));
    }
  },
};
