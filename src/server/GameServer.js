var ClientManager = require('./ClientManager');
var World = require('../common/World');
var EntityManager = require('../common/Physics/EntityManager');
var config = require('../../config');
var _ = require('lodash');
var GameServer = function(entityManager,physics,playerSockets,gameOverCallback){
    this.entityManager = entityManager;
    this.physics = physics;
    this.playerSockets = playerSockets;
    this.physics.updateWorldCallback = this.sendToClients.bind(this);
    this.gameOverCallback = gameOverCallback;
    MODE = 'server'
};
GameServer.prototype.playerHeart = {};
GameServer.prototype.mapHearts = function(){
    var self = this;
    _.each(this.playerSockets,function(p){
        self.playerHeart[p.id] = self.entityManager.getPlayerHeart(p.id);
    })
};
GameServer.prototype.sendInitialObjects = function(client){
    var packet = {
        m:'world-start',
        d:this.physics.worldManager.getCurrentState()
    };
    this.mapHearts();
    client.send(JSON.stringify(packet));
};
GameServer.prototype.sendAllInitialObjects = function(except){
    var self = this;
    _.each(this.playerSockets,function(p,i){
        if(i != except) {
            if(config.dt)
                setTimeout(handle.bind(null,i),config.dt);
            else
                handle(p);
        }
    });

    function handle(p){
        p && self.sendInitialObjects(p);
    }
}

GameServer.prototype.updateWorld = function(client){
    this.physics.updateWorld(client)
};

GameServer.prototype.sendToClients = function(message, data, except){
    var packet = {
        m: message,
        d: data
    };
    var self = this;
    _.each(this.playerSockets,function(p,i){
        if(i != except) {
            packet.t = (new Date()).getTime() + 2000;
            if(config.dt)
                setTimeout(handle.bind(null,i,packet),config.dt);
            else
                handle(p,packet);
        }
    });

    function handle(p,packet){
        p && p.send(JSON.stringify(packet));
    }


};

GameServer.prototype.pong = function(client, data) {
    var packet = {
        m: 'pong',
        d: data,
        t:new Date().getTime() + 2000
    };
    if(config.dt)
        setTimeout(handle,config.dt);
    else
        handle();
    function handle(){
        client.send(JSON.stringify(packet));
    }
};

GameServer.prototype.onMessage = function(client,packet){
    if(packet && packet.m){
        GameServer.acceptableMessages[packet.m] && this[GameServer.acceptableMessages[packet.m]](packet,client);
    }
};
GameServer.prototype.onKeyPressed = function(packet,client){this.onKeyAction(packet,client,'onKeyPressed');};
GameServer.prototype.onKeyReleased = function(packet,client){this.onKeyAction(packet,client,'onKeyReleased');};
GameServer.prototype.onKeyAction = function(packet,client,action){
    var entities = this.entityManager.getEntitiesToBeTriggered(packet.d,client.id);
    _.each(entities,function(entity){
        entity && entity[action] && entity[action](packet.d)
    });
};

GameServer.prototype.onPing = function(packet,client){}
GameServer.prototype.checkStatus = function(){
    var self = this;
    if(this.entityManager.deadPlayers.length){
        return this.gameOverCallback(this.entityManager.deadPlayers.length>1?'draw':this.entityManager.deadPlayers[0]);
    }
    _.each(this.playerHeart,function(heart,id){

        if(heart && heart.body.GetPosition().y<-15){

            return self.gameOverCallback && self.gameOverCallback(id)
        }
    })
};

GameServer.prototype.destroy = function(){
    delete this.physics;
    delete  this.entityManager
};
GameServer.acceptableMessages = {
    'keyPressed':'onKeyPressed',
    'keyReleased':'onKeyReleased',
    'ping':'onPing'
}
module.exports = GameServer;
