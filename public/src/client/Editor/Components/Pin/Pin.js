var Pin = BaseObject.extend({
    joint:null,
    world:null,
    options:{
        radius:5
    },
    ctor:function(world,options){
        this._super()
        this.world = world;
        this.options = _.extend({},this.options,options);
        this.sprite = new PinSprite(this.options);
        if(options.position)
            this.sprite.setPosition(options.position)
        this.sprite.setAnchorPoint(0.5,0.5)
        this.checkAndCreateJoint()
    },
    findFixtures:function(){
        var fixtures = [];
        function queryCallback(fixture){
            fixtures.push(fixture);
            if(fixtures.length<2)
                return true;
        }
        this.world.QueryPoint(queryCallback,cc.convertPointToMeters(this.sprite.getPosition()));
        return fixtures;
    },
    createJointForFixtures:function(fixtures){
        var bodyA = fixtures[0].GetBody(),
            bodyB = fixtures[1].GetBody(),
            jointDef = this.createJointDefForBodiesWithPivot(bodyA,bodyB,cc.convertPointToMeters(this.sprite.getPosition()))
        this.joint = this.world.CreateJoint(jointDef);

    },
    createJointDefForBodiesWithPivot:function(bodyA,bodyB,pivot){
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = bodyA;
        joint_def.bodyB = bodyB;
        joint_def.localAnchorA = bodyA.GetLocalPoint(pivot);
        joint_def.localAnchorB = bodyB.GetLocalPoint(pivot);
        return joint_def;
    },
    updateBodyFromSprite:function(){
        if(!this.sprite)
            return;
        this.removeJoint();
        this.checkAndCreateJoint();
    },
    update:function(dt){
        if(!this.joint)
            return;
        var jointPosInMeters = this.joint.GetAnchorA()
        this.sprite.setPosition(cc.convertMetersToPoint(jointPosInMeters));
    },
    removeFromParent:function () {
        this.removeJoint();
        this.sprite.removeFromParent();
        this.sprite = null;
    }


});