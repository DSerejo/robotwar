var EntityFactory = require('../common/Physics/EntityFactory'),
    TestScenes = require('../client/Editor/TestScenes'),
    EntityManager = require('../common/Physics/EntityManager'),
    World = require('../common/World');
var _ = require('lodash');
var Physics = {};
var worldManager;
var world;
Physics.startWorld = function(callback){
    worldManager = new World(EntityFactory);
    worldManager.setupWorld(TestScenes.running);
    world = World.world;
    callback && callback()
};
Physics.lastUpdate = null;
var stepCount = 0;
Physics.update = function(){
    var lastUpdate = new Date().getTime();
    world.Step(1/60, 10, 10);
    world.ClearForces();
    EntityManager.performAllActions(function(isUpdateNeeded){
        if(isUpdateNeeded)
            Physics.updateWorld();
    });
};
Physics.getDeltaTime = function(){
    var now = new Date().getTime(),
        dt = Physics.lastUpdate?(now - Physics.lastUpdate)/1000:1/60;
    Physics.lastUpdate = now;
    return dt;
};
Physics.updateWorldCallback = null;
Physics.setUpdateWorldCallback = function(callback){
    Physics.updateWorldCallback = callback
};

Physics.updateWorld = function(){
    var body = world.GetBodyList();
    var update = {};
    var isUpdateNeeded = false;

    do {
        var userData = body.GetUserData();

        if(userData && userData.id && body.IsAwake()){
            update[userData.id] = {
                p: body.GetPosition(),
                a: body.GetAngle(),
                lv: body.GetLinearVelocity(),
                av: body.GetAngularVelocity()
            };
            isUpdateNeeded = true;
        }
    } while (body = body.GetNext());


    if(isUpdateNeeded) {
        Physics.updateWorldCallback && Physics.updateWorldCallback('world-update', update, null);
    }
};

Physics.getBodies = function(){
    if(!world) return [];
    var body = world.GetBodyList(),
        bodies = [];

    do {
        var userData = body.GetUserData();

        if(userData && userData.id && body.IsAwake()){
            bodies.push(userData.toObject());
        }
    } while (body = body.GetNext());
    return bodies;
}

Physics.getJoints = function(){
    if(!world) return [];
    var joints = [];

    _.each(EntityManager.joints,function(joint,id){
        if(joint.joint){
            joints.push(joint.toObject());
        }
    });
    return joints;

};
module.exports = Physics;