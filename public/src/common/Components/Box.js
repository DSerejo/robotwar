if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    Entity = require('../Physics/Entity')
    BoxBody = require('../Physics/BoxBody')
}
var BoxPhysics = function(){};
Box2D.inherit(BoxPhysics,Entity);
BoxPhysics.prototype.addBody = function(){
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
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = BoxPhysics;
}