const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = {
    entry: allEntries,
    output: {
        path: destination + 'js', // path.resolve(__dirname + '/..' , destination ),
        publicPath: 'js/',
        filename: '[name].app.js'
    },
    plugins: pagePlugins,
};