var start = require('./index');
var _ = require('lodash');
var RobotPositionAdjuster = function(robot,playerId,offsetPosition){
    this.adjust = function(){
        _.each(robot.bodies,function(b){
            b.playerId = playerId;
            b.id = playerId + "_" + b.id;
            if(offsetPosition)
                b.position.x+=offsetPosition;
        });
        _.each(robot.joints,function(b){
            b.playerId = playerId;
            b.id = playerId + "_" + b.id;
            b.bodyAId = playerId + "_" + b.bodyAId;
            b.bodyBId = playerId + "_" + b.bodyBId;
            if(offsetPosition)
                b.position.x+=offsetPosition;
        });
    };

};
var Room = function(id,io,clientManager){
    this.id = id;
    this.players = [];
    this.newGame = null;
    this.running = false;
    this.clientManager = clientManager;
    this.start = function(){
        var entities = this.prepareEntities();
        this.newGame = new start(this.players,entities,this.gameOver.bind(this));
        this.running = true;
    };
    this.gameOver = function(loserId){
        var self = this;
        _.each(this.players,function(s,id){
            self.notifyPlayers(id==loserId?Room.closeReasons.lose:Room.closeReasons.win,id);
        });
        this.stop();
    };
    this.prepareEntities = function (){
        var bodies = [],
            joints = [],
            offset = 0;
        _.each(this.clientManager.robots,function(r,id){
            var robot = JSON.parse(r),
                adjuster = new RobotPositionAdjuster(robot,id,offset);
            adjuster.adjust();
            bodies = bodies.concat(robot.bodies);
            joints = joints.concat(robot.joints);
            offset+=10;
        });
        return {bodies:bodies,joints:joints}
    };
    this.updatePlayers = function(){
        var roomClients = io.nsps['/'].adapter.rooms[this.id];
        this.players = {};
        var self = this;
        _.each(roomClients.sockets,function(a,id){
            self.players[id]=io.sockets.connected[id];
        })
    };
    this.addPlayerSocket = function(socket){
        socket.join(this.id);
        socket.send(JSON.stringify({m:'room',d:this.id}));
        this.updatePlayers();
    };
    this.removePlayerSocket = function(socket){
        delete this.players[socket.id]
        this.running && this.stop(Room.closeReasons.opponentLeft);
    };
    this.stop = function(reason){
        reason && this.notifyPlayers(reason);
        this.running = false;
        this.newGame && this.newGame.stop();
        this.destroy();
    };
    this.destroy = function(){
        var self = this;
        io.sockets.in(this.id).clients(function(error,clients){
            clients.forEach(function(c){
                self.clientManager.clients[c].leave(self.id)
            })
        });
        this.newGame = null;
    };
    this.notifyPlayers = function(reason,id){
        var packet = JSON.stringify({m:'gameClosed',d:reason});
        if(id){
            return this.players[id].send(packet);
        }
        _.each(this.players,function(socket){
            socket.send(packet)
        })
    }
};
Room.closeReasons = {
    'gameEnd':'gameEnd',
    'opponentLeft':'opponentLeft',
    'win':'win',
    'lose':'lose'
}
Room.lastId=0;
module.exports = Room;