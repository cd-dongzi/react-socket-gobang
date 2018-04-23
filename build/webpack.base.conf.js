'use strict'
const path = require('path')
const resolve = dir => path.join(__dirname, '..', dir)
const assetsPath = dir => path.posix.join('static', dir)

//webpack 基本设置
module.exports = {
    entry: {
        app: './src/main.js'
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
            'src': resolve('src'),
            'components': resolve('src/components'),
            'assets': resolve('src/assets'),
            'actions': resolve('src/actions'),
            'connect': resolve('src/utils/connect')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: resolve("src")
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}