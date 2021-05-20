const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = {
    devtool: 'source-map' ,
    entry: './js/index.js',
    resolve: {
        extensions: ['.ts', '.js', '.json', '.wasm'],
    },
    module: {
        rules: [
            { test: /\.svg$/, use: 'svg-inline-loader' },
            {
              test: /\.css$/, use: [
                {
                    loader: 'style-loader',
                    options: {
                        injectType: 'linkTag',
                    }
                },
                // {loader: 'style-loader', options: { injectType: 'linkTag' }},
                {loader: 'file-loader' },
              ]
            },
            {
                test: /\.(ts)$/,
                exclude:/node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {"presets": ["@babel/preset-typescript"]}
                },
            },
            {
                test: /\.(js)$/,
                exclude:/node_modules/,
                use: {
                    loader: 'babel-loader',
                    // options: {"presets": ["env"]}
                },
            },
            { test: /\.(bin|png|jpe?g|gif)$/i, use: [ { loader: 'file-loader' }, ],},
            {
              test: /\.ttf$/,
              use: [
                {
                  loader: 'ttf-loader',
                  options: {
                    name: './font/[hash].[ext]',
                  },
                },
              ]
            },
            {
              test: /\.(gltf)$/,
              use: [
                {
                  loader: "gltf-webpack-loader"
                }
              ]
            }
        ]
      },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        // new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    mode: 'development',
    devServer: {
        contentBase: [
            path.resolve(__dirname, '.'),
        ],
        port: 5000,
        headers: {
            'Cache-Control': 'no-store',
        },
        watchContentBase: true,
    }
}

