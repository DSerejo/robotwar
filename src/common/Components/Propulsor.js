'use strict';
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var BoxBody = require('../Physics/BoxBody');
    var Materials = require('../Physics/Materials');
    var Box = require('./Box');
    var _ = require('lodash');
    var Entity = require('../Physics/Entity');
}
var Mixin = (sup) => {
    const fixedW = 0.75;
    const fixedH = 0.25;
    class PropulsorPhysics extends sup{

        constructor(id,pos,angle,force,actionKeys,world){
            super(id,fixedW,fixedH,pos,angle,Materials.metal(),Entity.types.propulsor,world);
            this.setInitialValues(force,actionKeys)
        }
        toObject(){
            return _.extend({},super.toObject(),{
                force: this.force,
                actionKeys: this.actionKeys
            });
        }
    }

    PropulsorPhysics.prototype.isOn = false;
    PropulsorPhysics.prototype.force = 30;
    PropulsorPhysics.prototype.setInitialValues = function(force,actionKeys){
        force && this.setForce(force);
        actionKeys && this.setActionKeys(actionKeys);
    };

    PropulsorPhysics.prototype.setForce = function(force){
        this.force = force
    };
    PropulsorPhysics.prototype.startStopPropulsor = function(keyPressed,start){
        var actionKey = this.getActionKey('start');
        if(!actionKey) return;
        switch (keyPressed){
            case actionKey:
                this.isOn = start;
                break;
            default:
                break;
        }
    };
    PropulsorPhysics.prototype.onKeyPressed = function(key){
        this.startStopPropulsor(key,true);
    };
    PropulsorPhysics.prototype.onKeyReleased = function(key){
        this.startStopPropulsor(key,false);
    };

    PropulsorPhysics.prototype.performAction = function(callback){
        if(this.isOn){
            this.applyForce();
            callback && callback(true);
        }
    };
    PropulsorPhysics.prototype.applyForce = function(){
        var direction = cc.pRotateByAngle(cc.p(0,1),cc.p(0,0),this.body.GetAngle());
        this.body.ApplyForce(cc.pMult(direction,this.force),this.body.GetWorldCenter());
    };

    return PropulsorPhysics
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = {
        PropulsorPhysics:Mixin(Box),
        Mixin:Mixin
    };
}