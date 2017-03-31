var Room = require('./GameRoom');
var _ = require('lodash');
var SearchingPlayersPool = function(ClientManager){
    this.players = [];
    this.playerIndex = {};
    this.playersTimouts = {};
    setInterval(this.findMatch.bind(this),1000);
    this.clientManager = ClientManager;
};
SearchingPlayersPool.prototype.findMatch = function(){
    var player1,player2;

    if(this.players.length>1){
        player1 = this.removePlayer(this.players[0].id);
        player2 = this.removePlayer(this.players[0].id);
        this.startMatch(player1,player2);
        this.findMatch();
    }

};
SearchingPlayersPool.prototype.removePlayer = function(id){
    var player = this.players[this.playerIndex[id]];
    this.playersTimouts[id] && clearTimeout(this.playersTimouts[id]);
    this.players.splice(this.playerIndex[id],1);
    delete this.playerIndex[id];
    delete this.playersTimouts[id];
    this.indexPlayers();
    this.opponentNotFound(player);
    return player;
};
SearchingPlayersPool.prototype.opponentNotFound = function(player){
    player && player.send(JSON.stringify({m:'opponentNotFound'}));
}   
SearchingPlayersPool.prototype.indexPlayers = function(){
    var self = this;
    _.each(this.players,function(p,i){
        self.playerIndex[p.id] = i;
    })
};

SearchingPlayersPool.prototype.startMatch = function(player1,player2){
    var roomId = 'room' + Room.lastId++;
    this.clientManager.newRoom(roomId);
    this.clientManager.addClientToRoom(player1,roomId);
    this.clientManager.addClientToRoom(player2,roomId);

};
SearchingPlayersPool.prototype.addPlayer = function(player){
    if(this.playerIndex[player.id]) return;
    this.players.push(player);
    this.playersTimouts[player.id] = setTimeout(this.removePlayer.bind(this,player.id),3000);
    this.indexPlayers();
};


module.exports = SearchingPlayersPool;