'use strict';
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var Entity = require('../Physics/Entity').default;

}
class BoxPhysics extends Entity{
    constructor(id,width,height,pos,angle,material,type,world){
        super(world);
        this.init(id,width,height,0,pos,angle,material,type||Entity.types.box);
    }
}


if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = BoxPhysics;
}