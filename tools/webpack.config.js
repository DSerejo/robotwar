'use strict';
let webpack = require ('webpack');
let path = require('path');


module.exports =  {
    watch:true,
    entry: [
        './src/main.js',

    ],
    output: {
        path:'/home/denny/workspace/robotwar/public',
        filename: 'game.js'
    },
    module:{
        loaders: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ],
        rules: [
            // instrument only testing sources with Istanbul
            {
                test: /\.js$/,
                include: path.resolve('src/client/Components/'),
                loader: 'istanbul-instrumenter-loader',
                query: {
                    esModules: true
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: false
    },
    devtool: 'source-map'
}