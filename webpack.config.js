const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {

    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'sa-filter-bootstrap3.js',
        library: 'SAFilter',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                /*use: [
                    { loader: 'style-loader' },
                    //{ loader: 'css-loader' },
                    { loader: "file-loader" }
                ]*/
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },

    devServer: {
        openPage: 'examples'
        //contentBase: path.join(__dirname, 'examples')
    },

    externals: {
        jquery: 'jquery',
        bootstrap: 'bootstrap'
    },

    plugins: [
        new ExtractTextPlugin('./sa-filter-bootstrap3.css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
