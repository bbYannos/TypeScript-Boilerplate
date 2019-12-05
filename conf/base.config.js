const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssConfig = require('./css.config');

// const destination = './dist/';
const destination = path.resolve(__dirname + '/../dist/') + '/';

const src = './src/';

const configuration = {};
configuration.plugins = [new CleanWebpackPlugin()];
configuration.module = {
    rules: []
};

/**
 * Js & Entries
 */
configuration.entry = {
    login: src + 'apps/login/index.ts',
    main: src + 'apps/main/index.ts'
};
configuration.output = {
    path: destination,
    publicPath: '',
    filename: 'js/[name].[hash].js'
};

/**
 * App Pages for multiples entries
 */
const pagePlugin = (name) => new HtmlWebpackPlugin({
    hash: true,
    template: src + 'Theme/index.html',
    chunks: [name],
    filename: destination + name + '.html' // path.resolve(__dirname + '/..', destination + )
});


for (let page in configuration.entry) {
    // noinspection JSUnfilteredForInLoop
    configuration.plugins.push(pagePlugin(page))
}


/**
 * Css
 */
configuration.plugins.push(CssConfig.cssPlugin);
configuration.module.rules.push(CssConfig.cssRule);

/**
 * TypeScript
 */
configuration.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
});

console.log(path.join(path.resolve(__dirname + '/..'), "/node_modules"));
configuration.resolve = {
    alias: {modules: path.join(path.resolve(__dirname + '/..'), "/node_modules")},
    extensions: ['.ts', '.js']
};

configuration.optimization = {
    splitChunks: {
        chunks: 'async',
    }
};


module.exports = configuration;