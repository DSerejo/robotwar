'use strict';
var cc = require('../../../constants').cc;
class BoxSprite extends cc.Node{
    
    constructor(width,height,fillColor,a){
        super();
        this.setDefaults();
        this.dn = new cc.DrawNode();
        this.fillColor = fillColor || this.fillColor;
        this.a = a|| this.a;
        this.addChild(this.dn);
        this.draw(width,height);
    }
    setDefaults(){
        this.fillColor = '#EFEFEF';
        this.a = 125;
    }
    init(parent){
        this.setAnchorPoint(cc.p(0.5,0.5));
        this.setRotation(-parent.angle)
    }
    draw(width,height){
        var fillColor = this.fillColor;
        this.dn.setContentSize(width,height);
        this.setContentSize(width,height);
        var fillColorObj = cc.hexToColor(fillColor);
        fillColorObj.a = this.a;
        this.dn.drawRect(cc.p(0,0), cc.p(width,height), fillColorObj, 1, cc.color("#6D6D6D"));

    }

}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = BoxSprite;
}