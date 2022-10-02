import webpack from 'webpack';
import HtmlWebpackPlugin from "html-webpack-plugin"
import path from "path";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: "./client/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./client/index.html",
            filename: "index.html",
        }),
    ],
    resolve: {
        modules: [__dirname, "node_modules"],
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
    devServer: {
        host: 'localhost',
        port: 3001,
        static: {
            directory: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: {
            '/NHLdata/**': {
                target: 'http://localhost:3002/',
                secure: false,
            },
            '/scheduleData/**': {
                target: 'http://localhost:3002/',
                secure: false,
            }
        }
    },
};