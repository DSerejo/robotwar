
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var EntityManager = require('./EntityManager');
    var Entity = require('./Entity');
    var Materials = require('./Materials');
    var BoxPhysics = require('../Components/Box');
    var PinPhysics = require('../Components/Pin');
    var PropulsorPhysics = require('../Components/Propulsor');
}
var EntityFactory = function(){};
EntityFactory.box = function(options){
    var material = Materials[options.material](),
        id = options.id || EntityManager.newID(),
        box = new BoxPhysics(id,options.width,options.height,0,options.position,options.angle,material,Entity.types.box)
    box.addBody();
    return box;
};
EntityFactory.pin = function(options){
    var pin = new PinPhysics(),
        bodyA = EntityManager.getEntityWithId(options.bodyAId).body.GetFixtureList(),
        bodyB = EntityManager.getEntityWithId(options.bodyBId).body.GetFixtureList(),
        id = options.id || EntityManager.newID();
    pin.init(id,options.position,[bodyA,bodyB]);
    return pin;
};
EntityFactory.propulsor = function(options){
    var id = options.id || EntityManager.newID(),
        propulsor = new PropulsorPhysics(id,options.position,options.angle,options.force,options.actionKeys);
    propulsor.addBody();
    return propulsor;
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = EntityFactory;
}