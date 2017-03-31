'use strict';
var PropulsorPhysicsMixin = require('../../../common/Components/Propulsor').Mixin;
import Entity from '../../../common/Physics/Entity';
import Materials from '../../../common/Physics/Materials';
import Box from '../Box/Box';
import BoxSprite from '../Box/BoxSprite';
import {mix} from 'mixwith';
var cc = require('../../../constants').cc;
var mixed = mix(Box).with(PropulsorPhysicsMixin);

class Propulsor extends mixed{
    constructor(id,pos,angle,force,actionKeys,world){
        super(id,pos,angle,Materials.metal(),Entity.types.propulsor,world);
        this.setInitialValues(force||this.defaultForce,actionKeys||{start:0});
        this.material = 'metal';
        this.countImpulse = 0;
        this.defaultForce = 30;
        this.isOn = false;
        this.editorProps.removeProperties(['material.name','h','w'])
        this.editorProps.addProperties({
            force:{number:true}
        })
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
    addW(dW){}
    
    addH(dh){}
}
export default Propulsor;