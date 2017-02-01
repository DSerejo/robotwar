var EntityFactory = require('../common/Physics/EntityFactory'),
    TestScenes = require('../client/Editor/TestScenes'),
    EntityManager = require('../common/Physics/EntityManager'),
    World = require('../common/World');
var _ = require('lodash');
var Physics = {};
var worldManager;
var world;
Physics.startWorld = function(){
    worldManager = new World(EntityFactory);
    worldManager.setupWorld(TestScenes.running);
    world = World.world
}
Physics.update = function(){
    world.Step(1 / 60, 10, 10);
    world.ClearForces();
};
Physics.updateWorld = function(client,callback){
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
        callback && callback('world-update', update, null);
    }
};

Physics.getBodies = function(){
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

    var joints = [];

    _.each(EntityManager.joints,function(joint,id){
        if(joint.joint){
            joints.push(joint.toObject());
        }
    });
    return joints;

};
module.exports = Physics;