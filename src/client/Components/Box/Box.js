//var mixin = require('mixwith');
var BoxPhysics = require('../../../../common/Components/Box');
var PhysicsObject = require('../../../Physics/Object');
var BoxSprite = require('./BoxSprite');
var MIXIN = require('../../../../../tools/mixwith/mixwith');
var cc = require('../../../../constants').cc;
var mixed = MIXIN.mix(BoxPhysics).with(PhysicsObject);
class Box extends mixed{
    constructor(id,width,height,pos,angle,material,type,world,box2dType){
        super(id,width,height,pos,angle,material,type,world,box2dType);
        this.box2dType = box2dType!==undefined?box2dType:this.box2dType;
        this.options = {}
        this.addBody();
        this.recreateSprite();
    }
    createSpriteObject(color,returnSprite){
        var sprite =new BoxSprite(cc.convertMetersToPixel(this.w),cc.convertMetersToPixel(this.h),color || this.material.fillColor);
        if(returnSprite){
            return sprite
        }
        this.sprite = sprite;
    }
    getId(){
        return this.id
    }
    updateBodyFromSprite(){
        if(!this.sprite)
            return;
        this.removeBody();
        var originalSize = cc.pFromSize(this.sprite.getContentSize()),
            scale = cc.p(this.sprite.getScaleX(),this.sprite.getScaleY());
        var box = cc.convertPointToMeters(cc.pCompMult(originalSize,cc.pMult(scale,1)));
        this.angle = -this.sprite.getRotation();
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.w = box.x;
        this.h = box.y;
        this.addBody();
        this.checkJointsToAdd();
    }

    setPosition(p){
        if(this.sprite)
            this.sprite.setPosition(p)
    }
    setRotation(a){
        if(this.sprite)
            this.sprite.setRotation(a)
    }

}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Box
}