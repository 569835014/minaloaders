const {resolve} = require('path')
const path = require('path')
const r = url => resolve(__dirname, url)
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cacheGroups=require('./cacheGroups')
const _resolve = (dir) => {
    return path.join(__dirname, '..', dir)
}
const config = require('../src/config')

module.exports = {
    devtool: false,
    output: {
        globalObject: 'System',
        path: config.assetsPath,
        filename: '[name].js'
    },
    resolve: {
        alias: {
            utils: r('../src/assets/utils')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [_resolve('src')]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }
                ],
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')({
                                    browsers: [
                                        'last 2 versions'
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }
                ],
            },
            {
                test: /\.mina$/,
                loader: 'smallmina-loader',
                options: {
                    source: 'src',
                    target: 'build',
                    extension: {
                        style: 'acss',
                        template: 'axml'
                    }
                }
            }
        ]
    },
    optimization: {
        splitChunks: {  //分割代码块
            cacheGroups: cacheGroups
        },
    },
    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            {
                from: 'app.acss',
                to: '',
                context: 'src/',

            },
            {
                from: '*.json',
                to: '',
                context: 'src/',

            },
            {
                from: 'pages/**/*.json',
                to: '',
                context: 'src/',

            },
            {
                from: 'components/**/*.json',
                to: '',
                context: 'src/',
            },
            {
                from: 'static',
                to: 'static'
            }
        ]),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 该插件帮助我们安心地使用环境变量
        new webpack.DefinePlugin({
        }),
        new webpack.ProvidePlugin({
            'utils': 'utils'
        }),
        new ProgressBarPlugin(),
    ]
}
