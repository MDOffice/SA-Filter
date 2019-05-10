const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = [
    {

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
            jquery: 'jQuery',
            bootstrap: 'bootstrap',
            'bootstrap-datepicker': 'bootstrap-datepicker'
        },

        plugins: [
            new ExtractTextPlugin('./sa-filter-bootstrap3.css'),
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
        ]
    }, {

        entry: './src/index.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'sa-filter-bootstrap3.bundle.js'
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
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                }
            ]
        },

        externals: {
            jquery: 'jquery'
        },

        plugins: [
            new ExtractTextPlugin('./sa-filter-bootstrap3.css'),
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
        ]
    }
];
