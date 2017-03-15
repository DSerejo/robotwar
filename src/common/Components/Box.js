'use strict';
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var Entity = require('../Physics/Entity');

}
var BoxPhysicsDef = function(){};
BoxPhysicsDef.prototype.ctor = function(id,width,height,pos,angle,material,type,world){
    this.init(id,width,height,0,pos,angle,material,type||Entity.types.box);
    this._super(world)
};

var BoxPhysics = Entity.extend(allMethodsAndProps(BoxPhysicsDef));

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = BoxPhysics;
}