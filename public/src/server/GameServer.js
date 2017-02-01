var ClientManager = require('./ClientManager');
var Physics = require('./Physics');
var GameServer = {};
GameServer.sendInitialObjects = function(client){
    var packet = {
        m:'world-start',
        d:{bodies:Physics.getBodies(),joints:Physics.getJoints()}
    };
    console.log(JSON.stringify(packet));
    client.send(JSON.stringify(packet));
};

GameServer.updateWorld = function(client){
    Physics.updateWorld(client,GameServer.sendToClients)
};

GameServer.sendToClients = function(message, data, except){
    var packet = {
        m: message,
        d: data
    };
    for (var i = 0; i < ClientManager.clients.length; i++) {
        if(ClientManager.clients[i] != except) {
            packet.t = (new Date()).getTime();
            ClientManager.clients[i].send(JSON.stringify(packet));
        }
    }
};

GameServer.pong = function(client, data) {
    var packet = {
        m: 'pong',
        d: data
    };
    client.send(JSON.stringify(packet));
};

GameServer.onMessage = function(client,packet){
    if(packet && packet.m){
        switch(packet.m){
            case 'jump':
                jump();
                this.updateWorld(client);
                break;
            case 'ping':
                this.pong(client, packet.d);
                break;
            default:
                break;
        }
    }
};

module.exports = GameServer;
