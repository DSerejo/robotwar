var chai = require("chai");
var jsxChai = require("jsx-chai");
//chai.use(jsxChai);
chai.use(require('chai-shallow-deep-equal'));

if(typeof window !== 'undefined'){
    window.expect = chai.expect;
}
global.expect = chai.expect;
global.testDir = function(dir){
    return dir.replace('/spec','');
};
global.importBox2d = function(){
    global.Box2D = require('../../public/engine/external/box2d/box2d');
    var fs = require('fs');
    eval(fs.readFileSync('./public/src/server/imports.js') + '');
};

