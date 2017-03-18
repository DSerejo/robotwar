
var mixin = require('mixin');
var PropulsorPhysicsMixin = require('../../../../common/Components/Propulsor').Mixin;
var Entity = require('../../../../common/Physics/Entity');
var Materials = require('../../../../common/Physics/Materials');
var Box = require('../Box/Box');
var BoxSprite = require('../Box/BoxSprite');
var MIXIN = require('../../../../../tools/mixwith/mixwith');
var cc = require('../../../../constants').cc;
var mixed = MIXIN.mix(Box).with(PropulsorPhysicsMixin);

class Propulsor extends mixed{
    constructor(id,pos,angle,force,actionKeys,world){
        super(id,pos,angle,Materials.metal(),Entity.types.propulsor,world);
        this.setInitialValues(force||this.defaultForce,actionKeys||{start:0});
        this.material = 'metal';
        this.countImpulse = 0;
        this.defaultForce = 30;
        this.isOn = false;
    }
    createSpriteObject(){
        this.sprite = new BoxSprite(cc.convertMetersToPixel(this.w),cc.convertMetersToPixel(this.h),'#eaae4d');
    }
    update(dt){
        super.update(dt)
        if(this.isOn) {
            this.applyForce()
        }
    }
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Propulsor;
}