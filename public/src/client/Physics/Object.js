PhysicsObjectDef = function(){};
PhysicsObjectDef.prototype.ctor  = function(world,options){
    this.world = world;
    this._super(options);
},
PhysicsObjectDef.prototype.makeBody = function(){
    throw  "Overwrite me";
},
PhysicsObjectDef.prototype.update = function (dt) {
    if(this.sprite!=null){
        this.setPosition(this.getPosition());
        this.setRotation(-this.getRotation());
    }
},
PhysicsObjectDef.prototype.setPosition = function(p){
    this.sprite.setPosition(p)
},
PhysicsObjectDef.prototype.setRotation = function(a){
    this.sprite.setRotation(a)
},
PhysicsObjectDef.prototype.getPosition = function () {
    if(this.body){
        var pos = this.body.GetPosition();
        return cc.pMult(pos,PMR/WORLD_SCALE);
    }
},
PhysicsObjectDef.prototype.getRotation = function () {
    if(this.body)
        return cc.radiansToDegrees(this.body.GetAngle());
},

PhysicsObjectDef.prototype.getBody = function () {
    return this.body;
},
PhysicsObjectDef.prototype.removeFromParent = function () {
    this.removeBody();
    this.sprite.removeFromParent();
    this.sprite = null;
},
PhysicsObjectDef.prototype.removeBody = function(){
    if(this.body){
        var joints = this.jointsToBeUpdated();
        World.world.DestroyBody(this.body);
        this.removeJoints(joints);
    }
    this.shape = null;
}
PhysicsObjectDef.prototype.jointsToBeUpdated = function(){
    var joint = this.body.GetJointList(),
        joints = [];
    if(!joint) return joints;
    do{
        joints.push(joint.joint.m_userData);
    } while(joint = joint.next)
    return joints;

};
PhysicsObjectDef.prototype.removeJoints = function(joints){
    joints.forEach(function(j){
        j.joint =null;
        j.recreateSprite()
    })
};
PhysicsObjectDef.prototype.checkJointsToAdd = function(){
    var self = this;
    _.each(EntityManager.joints,function(j){
        if(!j.joint && self.isTouched(j.sprite.getPosition())){
            j.checkAndCreateJoint();
            j.recreateSprite();
        }
    })
};
PhysicsObjectDef.prototype.calculateDamage = function(energy){
    var area = this.calculateArea(),
        absorbedEnergy = this.options.material.calculateAbsorbedEnergy(energy/area),
        damage = this.options.material.calculateDeformationRatio(absorbedEnergy);
    this.life -= damage;
    if(this.life<0){
        //this.isAlive = false;
    }
},
PhysicsObjectDef.prototype.calculateArea = function(){
    return this.body.GetMass()/this.body.GetFixtureList().GetDensity()
},
PhysicsObjectDef.prototype.updateKineticEnergy = function(){
    this.lastKineticEnergy  = EnergyCalc.kineticEnergy(this.body);
},
PhysicsObjectDef.prototype.getDiffEnergy = function(){
    return this.lastKineticEnergy - EnergyCalc.kineticEnergy(this.body)
},
PhysicsObjectDef.prototype.correctImpulseRateAfterDestruction = function(){
    if(this.life>0) return 1;
    var deathFactor = -1*this.life;
    return (deathFactor/(1 + deathFactor))*-1;
},
PhysicsObjectDef.prototype.updateImpulseCorrector = function(manifold,normal,impulse,factor){
    this.impulseCorrector = new ImpulseCorrector(this.prepareContactPoints(manifold),normal,impulse,factor)
},
PhysicsObjectDef.prototype.prepareContactPoints = function(manifold){
    var points = [];
    for( var i = 0; i<manifold.m_points.length;i++){
        var point = this.body.GetLocalPoint(manifold.m_points[i]);
        points.push(point)
    }
    return points
},
PhysicsObjectDef.prototype.applyImpulseCorrector = function(){
    if(!this.impulseCorrector) return;
    var totalImpulse = {
        x:0,
        y:0,
        w:0
    };
    for(var i = 0; i< this.impulseCorrector.points.length; i++){
        var point = this.impulseCorrector.points[i],
            normal = this.impulseCorrector.normal,
            impulseLength = this.impulseCorrector.impulse.normalImpulses[i],
            factor = this.impulseCorrector.factor,
            impulse = cc.pMult(normal,impulseLength*factor);
        //this.body.ApplyImpulse(impulse,point);
        //    result = this.getImpulseResult(impulse,point);
        //totalImpulse.x += result.x;
        //totalImpulse.y += result.y;
        //totalImpulse.w += result.w;
    }
    //this.body.m_linearVelocity.x += totalImpulse.x;
    //this.body.m_linearVelocity.y += totalImpulse.y;
    //this.body.m_angularVelocity += totalImpulse.w;
    this.impulseCorrector = null;
},
PhysicsObjectDef.prototype.getImpulseResult = function(impulse,point){
    var body = this.body;

    return {
        x:body.m_invMass * impulse.x,
        y:body.m_invMass * impulse.y,
        w: body.m_invI * ((point.x - body.m_sweep.c.x) * impulse.y - (point.y - body.m_sweep.c.y) * impulse.x)
    }

};

var PhysicsObject = BaseObject.extend(_p.allMethodsAndProps(PhysicsObjectDef));
var ImpulseCorrector = function(points,normal,impulse,factor){
    this.points = points || [];
    this.normal = normal || new b2Vec2();
    this.impulse = impulse || [];
    this.factor  = factor || 1
};
var EnergyCalc = {};
EnergyCalc.bodyLinV = function(b){
    return cc.pLength(b.GetLinearVelocity())
};
EnergyCalc.kineticEnergy = function(b){
    return EnergyCalc.linearKineticEnergy(b) + EnergyCalc.rotationalKineticEnergy(b)
};
EnergyCalc.linearKineticEnergy = function(b){
    return 0.5 * b.GetMass() * Math.pow(EnergyCalc.bodyLinV(b),2);
};
EnergyCalc.rotationalKineticEnergy = function(b){
    return 0.5 * b.GetInertia() * Math.pow(b.GetAngularVelocity(),2);
};