
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var Entity = require('./Entity');
    var Materials = require('./Materials');
    var BoxPhysics = require('../Components/Box');
    var PinPhysics = require('../Components/Pin');
    var PropulsorPhysics = require('../Components/Propulsor').PropulsorPhysics;
}
var EntityFactory = function(entityManager) {
    this.entityManager = entityManager;
};
EntityFactory.prototype.setWorld = function(world){
    this.world = world;
};
EntityFactory.prototype.box = function(options){
    var material = Materials[options.material](),
        id = options.id || this.entityManager.newID(),
        box = new BoxPhysics(id,options.width,options.height,options.position,options.angle,material,Entity.types.box,this.world);
    box.addBody();
    return box;
};
EntityFactory.prototype.pin = function(options){
    var id = options.id || this.entityManager.newID(),
        bodyA,bodyB,fixtures;
    if(options.bodyAId && options.bodyAId){
        bodyA  = this.entityManager.getEntityWithId(options.bodyAId).body.GetFixtureList();
        bodyB  = this.entityManager.getEntityWithId(options.bodyBId).body.GetFixtureList()
        fixtures = [bodyA,bodyB]
    }
    return new PinPhysics(id,options.position,fixtures,this.world);
};
EntityFactory.prototype.propulsor = function(options){
    var id = options.id || this.entityManager.newID(),
        propulsor = new PropulsorPhysics(id,options.position,options.angle,options.force,options.actionKeys,this.world);
    propulsor.addBody();
    return propulsor;
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = EntityFactory;
}