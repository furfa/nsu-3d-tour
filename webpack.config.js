const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './js/index.js',
    module: {
        rules: [
          { test: /\.svg$/, use: 'svg-inline-loader' },
          { test: /\.css$/, use: 'css-loader' },
          { test: /\.(js)$/, use: 'babel-loader' },
          { test: /\.(png|jpe?g|gif)$/i, use: [ { loader: 'file-loader' }, ],}
        ]
      },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
      },
    plugins: [
        // new HtmlWebpackPlugin()
        new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
    ],
    mode: 'development'  
}

