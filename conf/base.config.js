const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssConfig = require('./css.config');

// const destination = './dist/';
const destination = path.resolve(__dirname + '/../dist/') + '/';

const src = './src/';

const allEntries = {
    login: src + 'apps/login/index.js',
    main: src + 'apps/main/index.js'
};

const pagePlugin = (name) => new HtmlWebpackPlugin({
    hash: true,
    template: src + 'Theme/index.html',
    chunks: [name],
    filename: destination + name + '.html' // path.resolve(__dirname + '/..', destination + )
});

const pagePlugins = [];
for (let page in allEntries) {
    pagePlugins.push(pagePlugin(page))
}

const plugins = pagePlugins.concat([CssConfig.cssPlugin]);

module.exports = {
    entry: allEntries,
    output: {
        path: destination, // path.resolve(__dirname + '/..' , destination ),
        publicPath: '',
        filename: 'js/[name].[hash].js'
    },
    module: {
        rules: [
            CssConfig.cssRule
        ],
    },
    plugins: plugins,
};