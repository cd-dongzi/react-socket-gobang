"use strict"
const path = require('path')
const webpack = require('webpack')
const baseConf = require('./webpack.base.conf')

const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")


const resolve = dir => path.join(__dirname, '..', dir)
const assetsPath = dir => path.posix.join('/static/', dir)

const prod = merge({}, baseConf, {
    mode: 'production',
    output: {
        path: resolve('dist'),
        publicPath: './',
        filename: assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: assetsPath('js/[name].[chunkhash].js')
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    devtool: '#source-map',
    plugins: [

        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin(),


        // html配置
        new HtmlWebpackPlugin({
            filename: resolve('dist/index.html'),
            template: 'index.html',
            favicon: resolve('static/favicon.ico'),
            inject: true,
            minify: {
                //去除空格
                collapseWhitespace: true,
                //去除属性引号
                removeAttributeQuotes: true
            }
        })
    ]
})

module.exports = prod