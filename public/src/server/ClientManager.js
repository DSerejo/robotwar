var _ = require('lodash');
var Room = require('./GameRoom');


var ClientManager = {
    clients:{},
    rooms:{},
    clientRooms:{},
    robots:{}
};
ClientManager.newRoom = function(id){
    this.rooms[id]= new Room(id,ClientManager.io,this);
};
ClientManager.removeRoom = function(id){
    this.rooms[id].stop();
    delete this.rooms[id];
};
ClientManager.addClient = function(client){
    this.clients[client.id]=client;
};
ClientManager.removeClient = function(client){
    var self = this;
    var room = self.rooms[self.clientRooms[client.id]]
    room && room.removePlayerSocket(client);
    delete this.robots[client.id];
    delete this.clientRooms[client.id];
    delete this.clients[client.id];
};

ClientManager.addClientToRoom = function(client,room){
    this.rooms[room].addPlayerSocket(client);
    this.clientRooms[client.id] = room;
    if(Object.keys(this.rooms[room].players).length==2){
        this.rooms[room].start();
    }
};
ClientManager.canSendMessageToRoom = function(client,room){
    return client.rooms[room]
};
module.exports = ClientManager;
