'use strict';
import BoxPhysics from '../../../common/Components/Box';
import PhysicsObject from '../../Physics/Object';
import BoxSprite from './BoxSprite';
import {mix} from '../../../../tools/mixwith/mixwith';
import {cc} from '../../../constants';
var BoxPhysicsNode = mix(BoxPhysics).with(PhysicsObject);
class Box extends BoxPhysicsNode{
    constructor(id,width,height,pos,angle,material,type,world,box2dType){
        super(id,width,height,pos,angle,material,type,world,box2dType);
        this.box2dType = box2dType!==undefined?box2dType:this.box2dType;
        this.options = {};
        this.addBody();
        this.recreateSprite();
    }
    createSpriteObject(color,returnSprite){
        var sprite = Box.createSpriteObject(this.w,this.h,color || this.material.fillColor);
        if(returnSprite){
            return sprite;
        }
        this.sprite = sprite;
    }
    static createSpriteObject(w,h,color){
        return new BoxSprite(cc.convertMetersToPixel(w),cc.convertMetersToPixel(h),color);
    }
    getId(){
        return this.id;
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
        this.event.trigger('change');
    }

    setPosition(p){
        if(this.sprite)
            this.sprite.setPosition(p);
    }
    setRotation(a){
        if(this.sprite)
            this.sprite.setRotation(a);
    }

}
export default Box;