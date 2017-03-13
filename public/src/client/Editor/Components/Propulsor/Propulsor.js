

var Propulsor = PropulsorPhysics.extend(_p.allMethodsAndProps(Box),{
    fixedWidth:0.75,
    fixedHeight:0.25,
    material:'metal',
    countImpulse:0,
    defaultForce:30,
    isOn:false,
    ctor:function(id,pos,angle,force,actionKeys,world){
        this._super(id,pos,angle,force||this.defaultForce,actionKeys||{start:0},world);
        this.toObject = PropulsorPhysics.prototype.toObject
    },
    createSpriteObject:function(){
        this.sprite = new BoxSprite(cc.convertMetersToPixel(this.w),cc.convertMetersToPixel(this.h),'#eaae4d');
    },
    update:function(dt){
        this._super(dt)
        if(this.isOn) {
            this.applyForce()
        }
    }

});
