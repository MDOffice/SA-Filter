const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//import ExtractTextPlugin from 'extract-text-webpack-plugin';

const common = {
    entry: "./src/index.js",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};

module.exports = [
    merge(common, {
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "sa-filter-bootstrap3.js",
            library: "SAFilter",
            libraryTarget: "umd",
            umdNamedDefine: true
        },

        devServer: {
            openPage: "examples"
            //contentBase: path.join(__dirname, 'examples')
        },

        externals: {
            jquery: "jQuery",
            bootstrap: "bootstrap"
        },

        plugins: [
            new ExtractTextPlugin("./sa-filter-bootstrap3.css"),
            new webpack.ProvidePlugin({
                $: "jquery"
            })
        ]
    }),
    merge(common, {
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'sa-filter-bootstrap3.bundle.js',
            library: 'SAFilter'
        },

        externals: {
            jquery: "jquery",
            bootstrap: "bootstrap"
        },

        plugins: [
            new ExtractTextPlugin("./sa-filter-bootstrap3.css"),
            new webpack.ProvidePlugin({
                $: "jquery"
            })
        ]
    })
];
