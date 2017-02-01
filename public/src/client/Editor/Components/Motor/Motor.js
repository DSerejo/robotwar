var Motor = Pin.extend({
    options:{
        motorSpeed:10,
        maxMotorToque:30
    },
    ctor:function(world,options){
        this._super(world,options)
        this.setOptions(options)
    },
    createJointDefForBodiesWithPivot:function(bodyA,bodyB,pivot){
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = bodyA;
        joint_def.bodyB = bodyB;
        joint_def.localAnchorA = bodyA.GetLocalPoint(pivot);
        joint_def.localAnchorB = bodyB.GetLocalPoint(pivot);
        joint_def.enableMotor = true;
        joint_def.motorSpeed = 0;
        joint_def.maxMotorTorque = 30;
        return joint_def;
    },
    onKeyPressed:function(key){
        switch (key){
            case 65:
                this.joint.SetMotorSpeed(-this.options.motorSpeed);
                break;
            case 68:
                this.joint.SetMotorSpeed(this.options.motorSpeed);
                break;
            default:
                break;

        }
    },
    onKeyReleased:function(){
        this.joint.SetMotorSpeed(0);

    }

})