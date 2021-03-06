const base = require("./base.config");
const path = require('path');
const dest = './dist';
const destination = path.resolve(__dirname + '/../', dest) + '/';

base.devServer = {
    contentBase: destination,
    compress: true,
    port: 9000,
    open: "firefox",
    hot: true,
};

base.stats = {
    entrypoints: false,
    chunks: false,
    modules: false,
    children: false,
};

const CircularDependencyPlugin = require('circular-dependency-plugin');
const circularDependencyPlugin = new CircularDependencyPlugin({
    onStart({compilation}) {
        console.log('start detecting webpack modules cycles');
    },
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // allow import cycles that include an asyncronous import,
    // e.g. via import(/ webpackMode: "weak" / './file.js')
    allowAsyncCycles: false,
    // set the current working directory for displaying module paths
    cwd: process.cwd()
});
base.plugins.push(circularDependencyPlugin);

module.exports = Object.assign(base, {
    mode: 'development'
});
