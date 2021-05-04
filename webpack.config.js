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
            { test: /\.css$/, use: 'css-loader' },
            {
                test: /\.(ts)$/,
                use: {
                    loader: 'babel-loader',
                    options: {"presets": ["@babel/preset-typescript"]}
                },
            },
            {
                test: /\.(js)$/,
                use: {
                    loader: 'babel-loader',
                    // options: {"presets": ["env"]}
                },
            },
            { test: /\.(png|jpe?g|gif)$/i, use: [ { loader: 'file-loader' }, ],}
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
            path.resolve(__dirname, 'dist'),
            path.resolve(__dirname, '.'),
        ],
        port: 5000,
        headers: {
            'Cache-Control': 'no-store',
        },
        watchContentBase: true,
    }
}

