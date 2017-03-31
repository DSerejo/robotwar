var _ = require('lodash');
module.exports = webpackOverrides;

function webpackOverrides(defaultConfig) {
    var newConfig = _.cloneDeep(defaultConfig);
    newConfig.entry =  './main.js'
    return newConfig;
}