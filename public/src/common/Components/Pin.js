var PinPhysics = function(){};
PinPhysics.prototype.pos  = new b2Vec2();
PinPhysics.prototype.joint  = null;
PinPhysics.prototype.id  = null;

PinPhysics.prototype.init = function(id,pos,fixtures){
    this.id = id;
    this.pos = pos;
    this.createJointForFixtures(fixtures)
};

PinPhysics.prototype.checkAndCreateJoint = function(){
    var fixtures = this.findFixtures();
    if(fixtures.length==2){
        this.createJointForFixtures(fixtures);
    }
};
PinPhysics.prototype.findFixtures = function(){
    var fixtures = [];
    function queryCallback(fixture){
        fixtures.push(fixture);
        if(fixtures.length<2)
            return true;
    }
    World.world.QueryPoint(queryCallback,cc.convertPointToMeters(this.sprite.getPosition()));
    return fixtures;
};
PinPhysics.prototype.checkAndCreateJoint = function(){
    var fixtures = this.findFixtures();
    if(fixtures.length==2){
        this.createJointForFixtures(fixtures);
    }
};
PinPhysics.prototype.createJointForFixtures = function(fixtures){
    var bodyA = fixtures[0].GetBody(),
        bodyB = fixtures[1].GetBody(),
        jointDef = this.createJointDefForBodiesWithPivot(bodyA,bodyB,this.pos);
    this.joint = World.world.CreateJoint(jointDef);
};
PinPhysics.prototype.createJointDefForBodiesWithPivot = function(bodyA,bodyB,pivot){
    var joint_def = new b2RevoluteJointDef();
    joint_def.bodyA = bodyA;
    joint_def.bodyB = bodyB;
    joint_def.localAnchorA = bodyA.GetLocalPoint(pivot);
    joint_def.localAnchorB = bodyB.GetLocalPoint(pivot);
    return joint_def;
};
PinPhysics.prototype.removeJoint = function(){
    if(this.joint)
        World.world.DestroyJoint(this.joint)
    this.joint = null;
};
PinPhysics.prototype.toObject = function(){
    if(!this.joint) return;
    return {
        class:'pin',
        id:this.id,
        bodyAId: this.joint.m_bodyA.GetUserData().id,
        bodyBId: this.joint.m_bodyB.GetUserData().id,
        position: this.joint.m_bodyA.GetWorldPoint(this.joint.m_localAnchor1)
    }
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = PinPhysics;
}