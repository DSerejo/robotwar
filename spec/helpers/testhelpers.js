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
    eval(fs.readFileSync(__dirname + '/../../src/server/imports.js') + '');
};
global.mockCC = function(){
	var _p = typeof window !== 'undefined'?window:global;
	_p.cc.Node = class{
		addChild(){}
		setContentSize(){}
		getContentSize(){
			return {width:300,height:300}
		}
		setPosition(pos){
			this.pos = pos
		}
		getPosition(){return this.pos || {x:0,y:0}}
		setAnchorPoint(){}
		setRotation(){}
		getRotation(){return 0}
		getScaleX(){return 1}
		getScaleY(){return 1}
		getLocalZOrder(){
			return 0
		}
		removeAllChildren(){}
		removeFromParent(){}
		getChildByName(){
			return null;
		}
	};
	_p.cc.DrawNode = class extends _p.cc.Node{
		drawDot(){}
		drawRect(){}
	};
	_p.cc.hexToColor = ()=>{return {}}
	_p.cc.color = ()=>{return {}}
	_p.cc.pFromSize = function (s) {
		return cc.p(s.width, s.height);
	};	
}

