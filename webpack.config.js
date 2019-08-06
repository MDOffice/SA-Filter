const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//import ExtractTextPlugin from 'extract-text-webpack-plugin';

const common = {
    entry: './src/index.js',

    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory=true'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    devServer: {
        contentBase: [
            path.join(__dirname, 'examples'),
            path.join(__dirname, 'lib'),
            path.join(__dirname, 'dist')
        ],
        compress: true
    }
};

module.exports = [
    merge(common, {
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js',
            library: 'SAFilter',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },

        externals: {
            jquery: 'jQuery',
            bootstrap: 'bootstrap',
            events: 'EventEmitter'
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: './main.css'
            }),
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
        ]
    }),
    merge(common, {
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.bundle.js',
            library: 'SAFilter'
        },

        externals: {
            jquery: 'jquery',
            bootstrap: 'bootstrap',
            events: 'events'
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: './main.css'
            }),
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
        ]
    })
];
