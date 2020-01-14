const path = require('path');
const webpack = require('webpack');

const src = './src';
// js: dest/js, css: dest/css
const htmlIndex = src + '/assets/index.html';
const entries = {
    index: src + '/app/index.ts',
    // index: src + '/apps/login/index.ts',
    // admin: src + '/apps/admin/index.ts',
    // teacher: src + '/apps/speaker/index.ts',
};

const dest = './dist';
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
            assets: path.resolve(__dirname + '/../', 'src/assets/'),
            components: path.resolve(__dirname + '/../', 'src/components/'),
            layouts: path.resolve(__dirname + '/../', 'src/layouts/'),
            modules: path.resolve(__dirname + '/../', 'src/modules/'),
            shared: path.resolve(__dirname + '/../', 'src/shared/'),
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
// HTML Files
configuration.module.rules.push({
    test: /\.html$/,
    include: [path.resolve('src')],
    use: 'vue-template-loader',
    exclude: /assets/,
});

// Vue Files
const VueLoaderPlugin = require('vue-loader/lib/plugin');
configuration.plugins.push(new VueLoaderPlugin());
configuration.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
        loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
        }
        // other vue-loader options go here
    }
});
configuration.resolve.alias = {
    ...configuration.resolve.alias, ...{
        // full version
        // todo: https://fr.vuejs.org/v2/guide/installation.html
        vue: path.resolve(__dirname + '/../', 'node_modules/vue/dist/vue.js'),
    }
};
// Css
const CssConfig = require('./css.config');
configuration.plugins.push(CssConfig.cssPlugin);
configuration.module.rules = configuration.module.rules.concat(CssConfig.cssRules);

configuration.plugins.push(
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        moment: 'moment',
    })
);


// TypeScript With Babel
configuration.module.rules.push({
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        // appendTsSuffixTo: [/\.vue$/],
    }
});
configuration.resolve.extensions.push('.ts');

// Split chunks
configuration.optimization = {
    splitChunks: {
        minSize: 20000,
        cacheGroups: {
            abstract_api: {
                test: /(lodash|moment|rxjs|axios)/,
                chunks: 'all',
                priority: -1,
            },
            calendar: {
                test: /(@fullcalendar|Calendar|full\-calendar)/,
                chunks: 'all',
                priority: -2,
            },
            jquery: {
                test: /(jquery|dataTables|DataTable)/,
                chunks: 'all',
                priority: -3,
            },
            abstract_api: {
                test: /(abstract\-api|json2typescript|object\.utils|modules[\\/]Api)/,
                chunks: 'all',
                reuseExistingChunk: true,
                // enforce: true,
                priority: -4,
            },
            nodes: {
                test: path.resolve('node_modules'),
                chunks: 'all',
                priority: -6,
            },
            shared: {
                test: path.resolve('src/shared'),
                chunks: 'all',
                priority: -10,
                reuseExistingChunk: true,
            },
            modules: {
                test: path.resolve('src/modules'),
                chunks: 'all',
                priority: -15,
                reuseExistingChunk: true,
            },
            styles: {
                test: path.resolve('src/assets/vendor'),
                chunks: 'all',
                priority: -20,
                reuseExistingChunk: true,
                enforce: true,
            },
            default: {
                minChunks: 2,
                priority: -30,
                reuseExistingChunk: true
            }
        }
    }
};


module.exports = configuration;
