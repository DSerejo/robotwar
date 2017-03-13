if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    Entity = require('../Physics/Entity')
    BoxBody = require('../Physics/BoxBody')
}
var BoxPhysicsDef = function(){}
BoxPhysicsDef.prototype.ctor = function(id,width,height,pos,angle,material,type,world){
    this.init(id,width,height,0,pos,angle,material,type||Entity.types.box);
    this._super(world)
}
BoxPhysicsDef.prototype.addBody = function(){
    var boxBody = new BoxBody(
        this.w,
        this.h,
        b2_dynamicBody,
        this.material.density,
        this.material.restitution,
        this.material.friction,
        this.pos,
        this.angle,
        this
    );
    this.body = boxBody.body;
};
var BoxPhysics = Entity.extend(allMethodsAndProps(BoxPhysicsDef));

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = BoxPhysics;
}