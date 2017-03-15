if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    BoxBody = require('./BoxBody');
    DamageCalculator = require('./DamageCalculator');
}

var EntityDef = function(){};
EntityDef.prototype.id = null;
EntityDef.prototype.body = null;
EntityDef.prototype.sprite = null;
EntityDef.prototype.lastKineticEnergy = 0;
EntityDef.prototype.material = null;
EntityDef.prototype.w = 0;
EntityDef.prototype.h = 0;
EntityDef.prototype.radius = 0;
EntityDef.prototype.pos = b2Vec2();
EntityDef.prototype.angle = 0;
EntityDef.prototype.type = null;
EntityDef.prototype.life = 1;
EntityDef.prototype.initialized = false;
EntityDef.prototype.box2dType = b2_dynamicBody;

EntityDef.prototype.ctor = function(world){
    this.world = world;
};
EntityDef.prototype.init = function(id,width,height,radius,pos,angle,material,type){
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
EntityDef.prototype.addBody = function(){
    var boxBody = new BoxBody(this.w,this.h,this.box2dType,this.material.density,this.material.restitution,this.material.friction,this.pos,this.angle,this,this.world);
    this.body = boxBody.body;
    this.damage = new DamageCalculator(this);
}
EntityDef.prototype.remove = function(){
    this.sprite && this.removeFromParent();
    this.body && this.removeFromWorld();
};
EntityDef.prototype.removeFromParent = function(){
    this.sprite.removeFromParent();
};
EntityDef.prototype.removeFromWorld = function(){
    this.body.GetWorld().DestroyBody(this.body);
};

EntityDef.prototype.calculateArea = function(){
    return this.body.GetMass()/this.body.GetFixtureList().GetDensity()
};
EntityDef.prototype.updateKineticEnergy = function(){
    this.lastKineticEnergy  = EnergyCalc.kineticEnergy(this.body);
    this.lastLinVel = _.extend({},this.body.m_linearVelocity);
    this.lastAngVel = this.body.m_angularVelocity;
};
EntityDef.prototype.getDiffEnergy = function(){
    return this.lastKineticEnergy - EnergyCalc.kineticEnergy(this.body)
};
EntityDef.prototype.setActionKeys = function(actionKeys){
    this.actionKeys = actionKeys;
};

EntityDef.prototype.getActionKey = function(action){
    if(this.actionKeys && this.actionKeys[action])
        return this.actionKeys[action];
};
EntityDef.prototype.toObject = function(){
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
var Entity = cc.Class.extend(EntityDef.prototype);
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