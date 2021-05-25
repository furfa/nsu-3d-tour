const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

// const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = (env) => {
    res = {
        devtool: 'source-map',
        entry: './js/index.js',
        resolve: {
            extensions: ['.ts', '.js', '.json', '.wasm'],
        },
        module: {
            rules: [
                {test: /\.svg$/, use: 'svg-inline-loader'},
                {
                    test: /\.css$/, use: [
                        {
                            loader: 'style-loader',
                            options: {
                                injectType: 'linkTag',
                            }
                        },
                        // {loader: 'style-loader', options: { injectType: 'linkTag' }},
                        {loader: 'file-loader'},
                    ]
                },
                {
                    test: /\.(ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {"presets": ["@babel/preset-typescript"]}
                    },
                },
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        // options: {"presets": ["env"]}
                    },
                },
                {test: /\.bin$/i, use: [{loader: 'file-loader'},],},
                {test: /\.(png|jpe?g|gif)$/i, use: 'file-loader',},
                // {
                //     test: /\.(png|jpe?g|gif)$/i,
                //     use: [
                //       {
                //         loader: ImageMinimizerPlugin.loader,
                //         options: {
                //           severityError: 'warning', // Ignore errors on corrupted images
                //           minimizerOptions: {
                //               plugins: [
                //                   ['gifsicle', { interlaced: true }],
                //                   ['jpegtran', { progressive: true }],
                //                   ['optipng', { optimizationLevel: 5 }],
                //                   [
                //                     'svgo',
                //                     {
                //                        plugins: [
                //                            {
                //                               removeViewBox: false,
                //                            },
                //                       ],
                //                     },
                //                   ],
                //               ],
                //           },
                //         },
                //       },
                //     ],
                // },
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
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new Dotenv(),

        ],

    };

    if(!env.production){
        res = {
            ...res,
            devtool : 'source-map',
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
        };
    }else{
        res = {
            ...res,
            mode: 'production',
        };
    }

    return res;
};
