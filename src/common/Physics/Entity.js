if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var BoxBody = require('./BoxBody');
    var DamageCalculator = require('./DamageCalculator');
    var _ = require('lodash');
}

var Entity = function(world){
    this.world = world;
};
Entity.prototype.id = null;
Entity.prototype.body = null;
Entity.prototype.sprite = null;
Entity.prototype.lastKineticEnergy = 0;
Entity.prototype.material = null;
Entity.prototype.w = 0;
Entity.prototype.h = 0;
Entity.prototype.radius = 0;
Entity.prototype.pos = new b2Vec2();
Entity.prototype.angle = 0;
Entity.prototype.type = null;
Entity.prototype.life = 1;
Entity.prototype.initialized = false;
Entity.prototype.box2dType = b2_dynamicBody;

Entity.prototype.init = function(id,width,height,radius,pos,angle,material,type){
    if(!id){
        throw 'Need id';
    }
    this.id = id;
    this.body = null;
    this.sprite = null;
    this.lastKineticEnergy = 0;
    this.material = material || null;
    this.w = width || 0;
    this.h = height || 0;
    this.radius = radius || 0;
    this.pos = pos || new b2Vec2();
    this.angle = angle || 0;
    this.type = type;
};
Entity.prototype.addBody = function(){
    var boxBody = new BoxBody(this.w,this.h,this.box2dType,this.material.density,this.material.restitution,this.material.friction,this.pos,this.angle,this,this.world);
    this.body = boxBody.body;
    this.damage = new DamageCalculator(this);
}
Entity.prototype.remove = function(){
    this.sprite && this.removeFromParent();
    this.body && this.removeFromWorld();
};
Entity.prototype.removeFromParent = function(){
    this.sprite.removeFromParent();
};
Entity.prototype.removeFromWorld = function(){
    this.body.GetWorld().DestroyBody(this.body);
};

Entity.prototype.calculateArea = function(){
    return this.body.GetMass()/this.body.GetFixtureList().GetDensity()
};
Entity.prototype.updateKineticEnergy = function(){
    this.lastKineticEnergy  = EnergyCalc.kineticEnergy(this.body);
    this.lastLinVel = _.extend({},this.body.m_linearVelocity);
    this.lastAngVel = this.body.m_angularVelocity;
};
Entity.prototype.getDiffEnergy = function(){
    return this.lastKineticEnergy - EnergyCalc.kineticEnergy(this.body)
};
Entity.prototype.setActionKeys = function(actionKeys){
    this.actionKeys = actionKeys;
};

Entity.prototype.getActionKey = function(action){
    if(this.actionKeys && this.actionKeys[action])
        return this.actionKeys[action];
};
Entity.prototype.toObject = function(){
    var obj = {};
    if(!this.body) return obj;
    obj = {
        'class':this.type,
        material:this.material.name,
        angle:cc.radiansToDegrees(this.body.GetAngle()),
        position:this.body.GetPosition(),
        lv:this.body.GetLinearVelocity(),
        av: this.body.GetAngularVelocity(),
        id:this.id,
        life:this.life,
        type:this.body.GetType()
    };
    if (this.body.m_fixtureList.m_shape.m_type == Box2D.Collision.Shapes.b2Shape.e_circleShape){
        obj.radius = this.body.m_fixtureList.m_shape.m_radius;
    }
    else if (this.body.m_fixtureList.m_shape.m_type == Box2D.Collision.Shapes.b2Shape.e_polygonShape){
        var boxExtents = this.body.m_fixtureList.m_shape.m_vertices[2];
        obj.width = boxExtents.x*2;
        obj.height = boxExtents.y*2;
    }
    return obj;
};

Entity.types = {
    box:'box',
    circle:'circle',
    propulsor:'propulsor'
};

var EnergyCalc = {}
EnergyCalc.bodyLinV = function(b){
    return cc.pLength(b.GetLinearVelocity())
}
EnergyCalc.kineticEnergy = function(b){
    return EnergyCalc.linearKineticEnergy(b) + EnergyCalc.rotationalKineticEnergy(b)
}
EnergyCalc.linearKineticEnergy = function(b){
    return 0.5 * b.GetMass() * Math.pow(EnergyCalc.bodyLinV(b),2);
}
EnergyCalc.rotationalKineticEnergy = function(b){
    return 0.5 * b.GetInertia() * Math.pow(b.GetAngularVelocity(),2);
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Entity;
}