
var Box = PhysicsObject.extend({
    ctor:function(id,width,height,pos,angle,material){
        this._super();
        this.init = BoxPhysics.prototype.init;
        this.addBody = BoxPhysics.prototype.addBody;
        this.remove = BoxPhysics.prototype.remove;
        this.toObject = BoxPhysics.prototype.toObject;
        this.removeFromWorld = BoxPhysics.prototype.removeFromWorld;
        this.init(id,width,height,0,pos,angle,material,Entity.types.box);
        this.addBody();
        this.recreateSprite();
    },
    createSpriteObject:function(){
        this.sprite = new BoxSprite(cc.convertMetersToPixel(this.w),cc.convertMetersToPixel(this.h),this.material.fillColor);
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
        var box = cc.convertPointToMeters(cc.pCompMult(originalSize,cc.pMult(scale,WORLD_SCALE)));
        this.angle = -this.sprite.getRotation();
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.w = box.x;
        this.h = box.y;
        this.addBody();
    },

    setPosition: function(p){
        if(this.sprite)
            this.sprite.setPosition(p)
    },
    setRotation: function(a){
        if(this.sprite)
            this.sprite.setRotation(a)
    },
    addX:function(dX){
        return Math.max(0.1,this.w+dX)
    }
});



