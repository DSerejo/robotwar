var mix= require('mixwith').mix;
var PinPhysics = require('../../../../common/Components/Pin');
var BaseObject = require('../../../Physics/Base');
var PinSprite = require('./PinSprite');
var cc = require('../../../../constants').cc;
var mixed = mix(PinPhysics).with(BaseObject);
class Pin extends mixed{
    constructor(id,pos,fixtures,world){
        super(id,pos,fixtures,world);
        this.setDefaults();
        this.recreateSprite();
    }
    setDefaults(){
        this.radius = 4;
        this.joinedColor = '#28cc12';
        this.unJoinedColor =  '#ff878b';
    }
    createSpriteObject(){
        this.sprite = new PinSprite(this.radius,this.joint?this.joinedColor:this.unJoinedColor);
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
        this.sprite.setAnchorPoint(0.5,0.5)
    }
    updateBodyFromSprite(){
        if(!this.sprite)
            return;
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.removeJoint();
        this.checkAndCreateJoint();
        this.recreateSprite();
    }
    update(dt){
        if(!this.joint)
            return;
        this.pos = this.joint.GetAnchorA();
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
    }
    removeFromParent () {
        this.removeJoint();
        this.sprite.removeFromParent();
        this.sprite = null;
    }
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Pin;
}