'use strict';
let webpack = require ('webpack');
let path = require('path');

module.exports =  {
    entry: [
        './src/main.js'
    ],
    output: {
        path: './public',
        filename: 'game.js'
    },
    module:{
        loaders: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: false
    },
    devtool: 'source-map'
}