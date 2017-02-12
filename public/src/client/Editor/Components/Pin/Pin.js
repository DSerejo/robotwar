var Pin = BaseObject.extend(allMethodsAndProps(PinPhysics), {
    radius:4,
    joinedColor:'#28cc12',
    unJoinedColor: '#ff878b',
    ctor:function(id,pos,fixtures){
        PinPhysics.prototype.ctor.bind(this)(id,pos,fixtures);
        this.recreateSprite();
    },
    createSpriteObject:function(){
        this.sprite = new PinSprite(this.radius,this.joint?this.joinedColor:this.unJoinedColor);
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
        this.sprite.setAnchorPoint(0.5,0.5)
    },
    updateBodyFromSprite:function(){
        if(!this.sprite)
            return;
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.removeJoint();
        this.checkAndCreateJoint();
        this.recreateSprite();
    },
    update:function(dt){
        if(!this.joint)
            return;
        this.pos = this.joint.GetAnchorA();
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
    },
    removeFromParent:function () {
        this.removeJoint();
        this.sprite.removeFromParent();
        this.sprite = null;
    }


});