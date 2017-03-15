var EntityFactory = require('../common/Physics/EntityFactory'),
    TestScenes = require('../client/Editor/TestScenes'),
    EntityManager = require('../common/Physics/EntityManager'),
    World = require('../common/World');
var _ = require('lodash');

var Physics = function(EntityManager){
    this.entityManager = EntityManager
};
Physics.prototype.startWorld = function(entities,callback){
    this.entityFactory = new EntityFactory(this.entityManager);
    this.worldManager = new World(this.entityFactory);
    this.worldManager.setupWorld(entities);
    this.world = this.worldManager.world;
    callback && callback()
};
Physics.lastUpdate = null;
var stepCount = 0;
Physics.prototype.update = function(){
    this.world.Step(1/60, 10, 10);
    this.world.ClearForces();
    var self = this;
    this.entityManager.performAllActions(function(isUpdateNeeded){
        if(isUpdateNeeded)
            self.updateWorld();
    });
};
Physics.prototype.getDeltaTime = function(){
    var now = new Date().getTime(),
        dt = Physics.lastUpdate?(now - this.lastUpdate)/1000:1/60;
    this.lastUpdate = now;
    return dt;
};
Physics.updateWorldCallback = null;
Physics.prototype.setUpdateWorldCallback = function(callback){
    this.updateWorldCallback = callback
};

Physics.prototype.updateWorld = function(){
    var body = this.world.GetBodyList();
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
        this.updateWorldCallback && this.updateWorldCallback('world-update', update, null);
    }
};


module.exports = Physics;