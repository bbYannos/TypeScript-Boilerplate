const path = require('path');
const webpack = require('webpack');

const src = './src';
// js: dest/js, css: dest/css
const dest = './dist';
const htmlIndex = src + '/assets/index.html';
const entries = {
    index: src + '/apps/login/index.ts',
    main: src + '/apps/main/index.ts',
};

const destination = path.resolve(__dirname + '/../', dest) + '/';
const configuration = {
    entry: entries,
    output: {
        path: destination,
        publicPath: '',
        chunkFilename: 'js/[name].[hash].bundle.js',
        filename: 'js/[name].[hash].js',
    },
    resolve: {
        alias: {
            assets: path.resolve(__dirname  + '/../', 'src/assets/'),
            modules: path.resolve(__dirname  + '/../', 'src/modules/'),
            shared: path.resolve(__dirname  + '/../', 'src/shared/'),
        },
        extensions: ['.js'],
    },
    plugins: [],
    module: {
        rules: []
    }
};

// CleanWebpackPlugin: Delete dist content before output
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
configuration.plugins = [new CleanWebpackPlugin()];

// Ignore Moment locales
configuration.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

// Generate HTML Files
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pagePlugin = (name) => new HtmlWebpackPlugin({
    hash: true,
    template: htmlIndex,
    chunks: [name],
    filename: destination + name + '.html'
});
for (let page in configuration.entry) {
    // noinspection JSUnfilteredForInLoop
    configuration.plugins.push(pagePlugin(page))
}

// Css
const CssConfig = require('./css.config');
configuration.plugins.push(CssConfig.cssPlugin);
configuration.module.rules = configuration.module.rules.concat(CssConfig.cssRules);


// TypeScript With Babel
configuration.module.rules.push({
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
});
configuration.resolve.extensions.push('.ts');

// Split chunks
configuration.optimization = {
    splitChunks: {
        minSize: 0,
        cacheGroups: {
            nodes: {
                test: path.resolve('node_modules'),
                chunks: 'all',
                priority: -10
            },
            shared: {
                test: path.resolve('src/shared'),
                chunks: 'all',
                priority: -10
            },
            modules: {
                test: path.resolve('src/modules'),
                chunks: 'all',
                priority: -10
            },
            styles: {
                test: path.resolve('src/assets'),
                chunks: 'all',
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
};


module.exports = configuration;
