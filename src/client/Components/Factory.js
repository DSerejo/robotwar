var Box = require('./Box/Box');
var Pin = require('./Pin/Pin');
var Propulsor = require('./Propulsor/Propulsor');
var Materials = require('../../../common/Physics/Materials');
var Entity = require('../../../common/Physics/Entity');
var Factory = function(entityManager) {
    this.entityManager = entityManager;
};
Factory.prototype.setWorld = function(world){
    this.world = world;
}
Factory.prototype.box = function(options){
    var id = options.id ||this.entityManager.newID(),
        material = Materials[options.material||Materials.default]();
    return new Box(id,options.width,options.height,options.position,options.angle,material,Entity.types.box,this.world);
};
Factory.prototype.pin = function(options){
    var bodyA,
        bodyB,
        fixtures;
    if(options.bodyAId){
        bodyA =this.entityManager.getEntityWithId(options.bodyAId).body.GetFixtureList();
        bodyB =this.entityManager.getEntityWithId(options.bodyBId).body.GetFixtureList();
        fixtures = [bodyA,bodyB];
    }
        const id = options.id ||this.entityManager.newID();
    return new Pin(id,options.position,fixtures,this.world);
};
Factory.prototype.propulsor = function(options){
    var id = options.id ||this.entityManager.newID()
    return new Propulsor(id,options.position,options.angle,options.force,options.actionKeys,this.world);
}

module.exports = Factory;
