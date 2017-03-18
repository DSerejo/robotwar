if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var _ = require('lodash');
}
var PinPhysicsDef = function(){};
PinPhysicsDef.prototype.pos  = new b2Vec2();
PinPhysicsDef.prototype.joint  = null;
PinPhysicsDef.prototype.id  = null;
PinPhysicsDef.prototype.type  = 'pin';
PinPhysicsDef.prototype.world  = 'null';

PinPhysicsDef.prototype.ctor = function(id,pos,fixtures,world){
    this.id = id;
    this.pos = pos;
    this.world = world;
    if(fixtures && fixtures.length){
        this.createJointForFixtures(fixtures);
    }

};

PinPhysicsDef.prototype.checkAndCreateJoint = function(){
    var fixtures = this.findFixtures();
    if(fixtures.length==2){
        this.createJointForFixtures(fixtures);
    }
};
PinPhysicsDef.prototype.findFixtures = function(){
    var fixtures = [];
    function queryCallback(fixture){
        fixtures.push(fixture);
        if(fixtures.length<2)
            return true;
    }
    this.world.QueryPoint(queryCallback,cc.convertPointToMeters(this.sprite.getPosition()));
    return fixtures;
};
PinPhysicsDef.prototype.checkAndCreateJoint = function(){
    var fixtures = this.findFixtures();
    if(fixtures.length==2){
        this.createJointForFixtures(fixtures);
    }
};
PinPhysicsDef.prototype.createJointForFixtures = function(fixtures){
    var bodyA = fixtures[0].GetBody(),
        bodyB = fixtures[1].GetBody(),
        jointDef = this.createJointDefForBodiesWithPivot(bodyA,bodyB,this.pos);
    this.joint = this.world.CreateJoint(jointDef);
};
PinPhysicsDef.prototype.createJointDefForBodiesWithPivot = function(bodyA,bodyB,pivot){
    var joint_def = new b2RevoluteJointDef();
    joint_def.bodyA = bodyA;
    joint_def.bodyB = bodyB;
    joint_def.localAnchorA = bodyA.GetLocalPoint(pivot);
    joint_def.localAnchorB = bodyB.GetLocalPoint(pivot);
    joint_def.userData = this;
    return joint_def;
};

PinPhysicsDef.prototype.remove = function() {
    if(this.sprite){
        this.removeFromParent();
    }
    this.removeJoint()
}

PinPhysicsDef.prototype.removeJoint = function(){
    if(this.joint)
        this.world.DestroyJoint(this.joint)
    this.joint = null;
};
PinPhysicsDef.prototype.toObject = function(){
    var object = {
        class:'pin',
        id:this.id,
        position:this.sprite?cc.convertPointToMeters(this.sprite.getPosition()):null,
        bodyAId:null,
        bodyBId:null
    };
    if(!this.joint) return object;
    return _.extend(object,{
        bodyAId: this.joint.m_bodyA.GetUserData().id,
        bodyBId: this.joint.m_bodyB.GetUserData().id,
        position: this.joint.m_bodyA.GetWorldPoint(this.joint.m_localAnchor1)
    })
}
var PinPhysics = cc.Class.extend(allMethodsAndProps(PinPhysicsDef));
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = PinPhysics;
}