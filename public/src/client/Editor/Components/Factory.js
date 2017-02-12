Factory = cc.Class.extend({})

Factory.box = function(options){
    var id = options.id || EntityManager.newID(),
        material = Materials[options.material||Materials.default]();
    return new Box(id,options.width,options.height,options.position,options.angle,material);
}
Factory.pin = function(options){
    var bodyA,
        bodyB,
        fixtures;
    if(options.bodyAId){
        bodyA = EntityManager.getEntityWithId(options.bodyAId).body.GetFixtureList();
        bodyB = EntityManager.getEntityWithId(options.bodyBId).body.GetFixtureList();
        fixtures = [bodyA,bodyB];
    }
        id = options.id || EntityManager.newID();
    return new Pin(id,options.position,fixtures);
};
Factory.propulsor = function(options){
    var id = options.id || EntityManager.newID()
    return new Propulsor(id,options.position,options.angle,options.force,options.actionKeys);
}

//Factory.wheel = function(world,options){
//    return new Wheel(world,options)
//}
//
//Factory.rod = function(world,options){
//    return new Rod(world,options)
//}
//Factory.pin = function(world,options){
//    return new Pin(world,options)
//}
//Factory.motor = function(world,options){
//    return new Motor(world,options)
//}
