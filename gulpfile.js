'use strict';
const Gulp = require('gulp');
const Gutil = require('gulp-util');
const Path = require('path');
const Newer = require('gulp-newer');
const Concat = require('gulp-concat');
const Webpack = require('webpack');
const Scss = require("gulp-scss");
const watch = require("gulp-watch");

let executionCount = 0;

Gulp.task('default',['scss','webpack']);

Gulp.task('watch', function() {
  watch('views/partials/editor/editor.scss', ['scss']);
});
Gulp.task("scss", function () {
    const bundleConfigs = [{
        entries: 'views/partials/editor/**/*.scss',
        dest: 'public/css'
    }];
    console.log(1);
    watch('views/partials/editor/editor.scss',function(){
        console.log(2);
        Gulp.src('views/partials/editor/editor.scss')
        .pipe(Scss())
        .pipe(Gulp.dest('public/css'))
    });
    //Gulp.src(
    //
    //).pipe(Scss()).pipe(Gulp.dest("public/css"));
    // bundleConfigs.forEach((bundleConfig) => {
    //     watch(bundleConfig.entries)
    //         .pipe(Scss())
    //         .pipe(Gulp.dest(bundleConfig.dest));
    // });
});
Gulp.task('webpack', (callback) => {

    const plugins = [
        //new Webpack.optimize.CommonsChunkPlugin({
        //    name: 'core',
        //    filename: 'core.min.js',
        //    minSize: 2
        //}),
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `"${process.env.NODE_ENV}"`
            }
        })
    ];

    let devtool = 'source-map';

    if (process.env.NODE_ENV === 'production') {
        plugins.push(new Webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }));

        devtool = 'cheap-module-source-map';
    }

    const config = {
        watch: true,
        entry: {
            editor: './views/partials/editor',
            game:'./src/main.js'
        },
        output: {
            path: './public/pages',
            filename: '[name].min.js',
            sourceMapFilename: '[name].map.js'
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react' ],
                    "plugins": ["transform-object-rest-spread","transform-es2015-parameters"]
                }
            },
                { test: /\.css$/, loader: "style-loader!css-loader" }
            ]
        },
        devtool,
        plugins
    };

    Webpack(config, (err, stats) => {

        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }

        Gutil.log('[webpack]', stats.toString({
            colors: true,
            chunkModules: false
        }));

        if (executionCount === 0) {
            callback();
        }

        executionCount += 1;
    });
});