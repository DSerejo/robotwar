
global.Box2D = require('../../engine/external/box2d/box2d');
var fs = require('fs');
eval(fs.readFileSync('./public/src/server/imports.js') + '');
var Physics = require('./Physics');
var EntityManager = require('../common/Physics/EntityManager');
var GameServer = require('./GameServer');

function NewGame(players,entities){

    var entityManager = new EntityManager();
    var physics = new Physics(entityManager)
    this.gameServer = new GameServer(entityManager,physics,players);
    physics.startWorld(entities, this.gameServer.sendAllInitialObjects.bind(this.gameServer));
    this.updateInterval = setInterval(physics.update.bind(physics), 1000 / 60);
    this.updateWorldInterval = setInterval(physics.updateWorld.bind(physics,null,this.gameServer.updateWorld.bind(this.gameServer)), 1000*6 / 60);
}
NewGame.prototype.stop = function(){
    clearInterval(this.updateInterval);
    clearInterval(this.updateWorldInterval);
}

module.exports = NewGame;



