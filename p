const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");

class InlineSourcePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("InlineSourcePlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        "InlineSourcePlugin",
        (data, cb) => {
          var html = `<div id="root"></div>`;
          Object.keys(compilation.assets).forEach((assetName) => {
            if (assetName === 'main.js') {
              const asset = compilation.assets[assetName];
              const jsContent = asset.source();
              html += `<script>${jsContent}</script>`;
              delete compilation.assets[assetName];
            }
          });
          data.html = html;
          cb(null, data);
        }
      );
    });
  }
}
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.plugins.push(
        new InlineSourcePlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        })
      );
      webpackConfig.output.filename = 'main.js';
      return webpackConfig;
    }
  }
}
