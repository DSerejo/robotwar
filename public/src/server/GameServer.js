var ClientManager = require('./ClientManager');
var Physics = require('./Physics');
var World = require('../common/World');
var EntityManager = require('../common/Physics/EntityManager');
var config = require('../../../config');
var _ = require('lodash');
var GameServer = {};

GameServer.sendInitialObjects = function(client){
    var packet = {
        m:'world-start',
        d:World.getCurrentState()
    };
    console.log(JSON.stringify(packet));
    client.send(JSON.stringify(packet));
};
GameServer.sendAllInitialObjects = function(except){
    for (var i = 0; i < ClientManager.clients.length; i++) {
        if(ClientManager.clients[i] != except) {
            if(config.dt)
                setTimeout(handle.bind(null,i),config.dt);
            else
                handle(i);
        }
    }
    function handle(i){
        ClientManager.clients[i] && GameServer.sendInitialObjects(ClientManager.clients[i]);
    }
}

GameServer.updateWorld = function(client){
    Physics.updateWorld(client)
};

GameServer.sendToClients = function(message, data, except){
    var packet = {
        m: message,
        d: data
    };
    for (var i = 0; i < ClientManager.clients.length; i++) {
        if(ClientManager.clients[i] != except) {
            packet.t = (new Date()).getTime() + 2000;
            if(config.dt)
                setTimeout(handle.bind(null,i,packet),config.dt);
            else
                handle(i,packet);
        }
    }
    function handle(i,packet){
        ClientManager.clients[i] && ClientManager.clients[i].send(JSON.stringify(packet));
    }


};

GameServer.pong = function(client, data) {
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

GameServer.onMessage = function(client,packet){
    if(config.dt)
        setTimeout(handle,config.dt);
    else
        handle();
    function handle(){
        if(packet && packet.m){
            switch(packet.m){
                case 'keyPressed':

                    var entities = EntityManager.actionKeys[packet.d];
                    _.each(entities,function(entity){
                        entity && entity.onKeyPressed && entity.onKeyPressed(packet.d)
                    });
                    break;
                case 'keyReleased':
                    var entities = EntityManager.actionKeys[packet.d];
                    _.each(entities,function(entity){
                        entity && entity.onKeyReleased && entity.onKeyReleased(packet.d)
                    });
                    break;
                case 'ping':
                    GameServer.pong(client, packet.d);
                    break;
                default:
                    break;
            }
        }
    }

};
Physics.updateWorldCallback = GameServer.sendToClients;
module.exports = GameServer;
