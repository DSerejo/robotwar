const webpackConfig = require('./tools/webpack.config');
const path = require('path');
webpackConfig.target = 'node';
module.exports = function(config) {
    config.set({
        basePath: 'public',
        frameworks: ['chai','mocha'],
        files: [
            '../tools/karma-preprocessor.js',
            '../node_modules/jquery/dist/jquery.min.js',
            'engine/CCBoot.js',
            'engine/external/box2d/box2d.js',
            'engine/cocos2d/core/platform/CCMacro.js',
            'engine/cocos2d/core/cocoa/CCGeometry.js',
            'engine/cocos2d/core/support/CCPointExtension.js',
            '../src/common/Globals.js',
            '../src/common/Math.js',
            '../src/main.js',
            '../tools/startGame.js',
            '../spec/src/client/Components/**/*.spec.js'
        ],
        exclude: [
        ],
        preprocessors: {
            '../spec/src/client/Components/**/*.spec.js': ['webpack','sourcemap'],
            '../src/main.js':['webpack'],
        },
        webpack:webpackConfig,
        reporters: ['progress','coverage-istanbul'],
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Firefox'],
        singleRun: true,
        //urlRoot:'/public',
        proxies: {
            '/': 'http://0.0.0.0:5000/'
        },
        coverageIstanbulReporter: {

            // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
            reports: ['html', 'lcovonly', 'text-summary'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, 'coverage'),

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,

            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {

                // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }

            }
        }
    });
};