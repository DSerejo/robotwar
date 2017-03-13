var ClientManager = require('./ClientManager');
var World = require('../common/World');
var EntityManager = require('../common/Physics/EntityManager');
var config = require('../../../config');
var _ = require('lodash');
var GameServer = function(entityManager,physics,playerSockets){
    this.entityManger = entityManager;
    this.physics = physics;
    this.playerSockets = playerSockets;
    this.physics.updateWorldCallback = this.sendToClients.bind(this);
};

GameServer.prototype.sendInitialObjects = function(client){
    var packet = {
        m:'world-start',
        d:this.physics.worldManager.getCurrentState()
    };
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
    var self = this;
    if(config.dt)
        setTimeout(handle,config.dt);
    else
        handle();
    function handle(){
        if(packet && packet.m){
            switch(packet.m){
                case 'keyPressed':
                    var entities = self.entityManger.getEntitiesToBeTriggered(packet.d,client.id);

                    _.each(entities,function(entity){
                        entity && entity.onKeyPressed && entity.onKeyPressed(packet.d)
                    });
                    break;
                case 'keyReleased':
                    var entities = self.entityManger.getEntitiesToBeTriggered(packet.d,client.id);
                    _.each(entities,function(entity){
                        entity && entity.onKeyReleased && entity.onKeyReleased(packet.d)
                    });
                    break;
                case 'ping':
                    //self.pong(client, packet.d);
                    break;
                default:
                    break;
            }
        }
    }

};
GameServer.destroy = function(){
    delete this.physics;
    delete  this.entityManger
};
module.exports = GameServer;
