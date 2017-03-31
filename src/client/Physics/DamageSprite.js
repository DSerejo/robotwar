"use strict";
var cc = require('../../constants').cc;
class DamageSprite{
    
    constructor(damage,object){
        this.setDefaults();
        var color = this.calculateDamageColor(damage),
            sprite = object.createSpriteObject(color,true);
        object.sprite.addChild(sprite,2);
        setTimeout(function(){
            sprite.removeFromParent()
        },this.timeToLiveInMilliseconds);
    }
    setDefaults(){
        this.timeToLiveInMilliseconds  = 500;
        this.minimumDamageColor = '#ffd4ce';
        this.maximumDamageColor = '#c41600';
    }
    calculateDamageColor(damage){

        return cc.lerpColor(this.minimumDamageColor,this.maximumDamageColor,Math.min(damage,1));

    }
}
module.exports = DamageSprite;