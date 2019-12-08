const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
module.exports = {
    cssPlugin: new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[hash].css',
    }),
    cssRules: [{
        test: /\.(sa|sc|c)ss$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: 'css/'
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
    }, {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '../fonts',
                publicPath: '../fonts'
            }
        }]
    }, {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /fontawesome|materialdesignicons/,
        loader: 'file-loader',
        options: {
            name: '[name].[ext]?[hash]',
            outputPath: '../img',
            publicPath: '../img'
        }
    }],
};
