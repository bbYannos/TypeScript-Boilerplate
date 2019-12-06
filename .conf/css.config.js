const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
module.exports = {
    cssPlugin: new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].[hash].css',
        chunkFilename: '[id].css',
    }),
    cssRule: {
        test: /\.(sa|sc|c)ss$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../css'
            },
        }, {
            loader: "css-loader",
            options: {
                sourceMap: true,
                url: true,
            }
        }, {
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.resolve(__dirname + '/vendor'),
                }
            }
        }, {
            loader: 'sass-loader'
        }]
    }
};