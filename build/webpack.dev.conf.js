'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const notifier = require("node-notifier")
const baseConf = require('./webpack.base.conf')


//webpack 基本设置
module.exports = merge({}, baseConf, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        // publicPath: '/'
    },
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        hot: true, // 热加载
        inline: true, //自动刷新
        open: true, //自动打开浏览器
        historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        host: 'localhost', //主机名
        port: '8080', //端口号
        proxy: {  //proxy代理
        },
        compress: true, //为你的代码进行压缩。加快开发流程和优化的作用
        overlay: { // 在浏览器上全屏显示编译的errors或warnings。
            errors: true,
            warnings: false
        },
        quiet: true // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),

        //配置html入口信息
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.html'),
            inject: true
        }),

        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [
                    `Your application is running here: http://localhost:8080`
                ]
            },
            onErrors: function (severity, errors) {
                if (severity !== "error") {
                    return
                }
                const error = errors[0]
                const filename = error.file.split("!").pop()
                //编译出错时,右下角弹出错误提示！
                notifier.notify({
                    message: severity + ": " + error.name,
                    subtitle: filename || ""
                })
            }
        })
    ]
}) 


