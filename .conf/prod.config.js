const base = require("./base.config");

const TerserPlugin = require('terser-webpack-plugin');
base.optimization = Object.assign(base.optimization, {
    minimize: true,
    minimizer: [new TerserPlugin()],
});

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// base.plugins.push(new BundleAnalyzerPlugin());

module.exports = Object.assign(base, {
    mode: 'production'
});
