if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    BoxBody = require('../Physics/BoxBody');
    Materials = require('../Physics/Materials');
    Box = require('./Box');
    _ = require('lodash');
    Entity = require('../Physics/Entity');
}
var PropulsorPhysicsDef = function(){};

PropulsorPhysicsDef.prototype.fixedW = 0.75;
PropulsorPhysicsDef.prototype.fixedH = 0.25;
PropulsorPhysicsDef.prototype.isOn = false;
PropulsorPhysicsDef.prototype.force = 30;

PropulsorPhysicsDef.prototype.ctor = function(id,pos,angle,force,actionKeys){
    force && this.setForce(force);
    actionKeys && this.setActionKeys(actionKeys);
    this._super(id,this.fixedW,this.fixedH,pos,angle,Materials.metal(),Entity.types.propulsor);
};
PropulsorPhysicsDef.prototype.setForce = function(force){
    this.force = force
};
PropulsorPhysicsDef.prototype.startStopPropulsor = function(keyPressed,start){
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
PropulsorPhysicsDef.prototype.onKeyPressed = function(key){
    this.startStopPropulsor(key,true);
};
PropulsorPhysicsDef.prototype.onKeyReleased = function(key){
    this.startStopPropulsor(key,false);
};

PropulsorPhysicsDef.prototype.performAction = function(callback){
    if(this.isOn){
        this.applyForce();
        callback && callback(true);
    }
};
PropulsorPhysicsDef.prototype.applyForce = function(){
    var direction = cc.pRotateByAngle(cc.p(0,1),cc.p(0,0),this.body.GetAngle());
    this.body.ApplyForce(cc.pMult(direction,this.force),this.body.GetWorldCenter());
};
PropulsorPhysicsDef.prototype.toObject = function(){
    return _.extend({},this._super(),{
        force: this.force,
        actionKeys: this.actionKeys
    });
}
var PropulsorPhysics = Box.extend(allMethodsAndProps(PropulsorPhysicsDef));

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = PropulsorPhysics;
}