const base = require("./base.config");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

base.optimization.minimize = true;
base.optimization.minimizer = [new TerserPlugin()];

base.plugins.push(new BundleAnalyzerPlugin());

module.exports = Object.assign(base, {
    mode: 'production'
});
