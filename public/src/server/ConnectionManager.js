var ClientManager = require('./ClientManager');
var GameServer = require('./GameServer');
var SearchingPlayersPool = require('./SearchingPlayersPool');

function ConnectionManager(io){
    this.io = io;
    this.pool = new SearchingPlayersPool(ClientManager);
    ClientManager.io = io;

    var self  = this;
    io.sockets.on('connection', function(client) {
        ClientManager.addClient(client);
        client.on('message', function(room,message){
                self.onMessage(client,room,message)
            }
        );
        client.on('disconnect', function(){
            ClientManager.removeClient(client);
            self.pool.removePlayer(client.id)
        });
    });
    this.onMessage = function(client,room,message){
        message = message || room;

        var fn = ConnectionManager.availableMessages[message.m];
        if(fn) return this[fn](client,message);

        if(ClientManager.canSendMessageToRoom(client,room)){
            var gameServer = ClientManager.rooms[room].newGame.gameServer;
            gameServer.onMessage.call(gameServer,client,message);
        }
    };
    this.onReceivePlayerRobot=function(client,packet){
        ClientManager.robots[client.id] = packet.d;
        this.pool.addPlayer(client);
    }

}
ConnectionManager.availableMessages = {'robot':'onReceivePlayerRobot'};
module.exports = ConnectionManager;