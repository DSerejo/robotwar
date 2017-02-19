var BoxDef = PhysicsObject.extend(_p.allMethodsAndProps(BoxPhysics));
var Box = BoxDef.extend({
    ctor:function(id,width,height,pos,angle,material,type){
        this._super.apply(this,arguments);
        this.addBody();
        this.recreateSprite();
    },
    createSpriteObject:function(color,returnSprite){
        var sprite =new BoxSprite(cc.convertMetersToPixel(this.w),cc.convertMetersToPixel(this.h),color || this.material.fillColor);
        if(returnSprite){
            return sprite
        }
        this.sprite = sprite;
    },
    getId:function(){
        return this.id
    },
    updateBodyFromSprite:function(){
        if(!this.sprite)
            return;
        this.removeBody();
        var originalSize = cc.pFromSize(this.sprite.getContentSize()),
            scale = cc.p(this.sprite.getScaleX(),this.sprite.getScaleY());
        var box = cc.convertPointToMeters(cc.pCompMult(originalSize,cc.pMult(scale,1)));
        this.angle = -this.sprite.getRotation();
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.w = box.x;
        this.h = box.y;
        this.addBody();
        this.checkJointsToAdd();
    },

    setPosition: function(p){
        if(this.sprite)
            this.sprite.setPosition(p)
    },
    setRotation: function(a){
        if(this.sprite)
            this.sprite.setRotation(a)
    }

});
