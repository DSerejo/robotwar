
global.Box2D = require('../../engine/external/box2d/box2d');
var fs = require('fs');
eval(fs.readFileSync('./public/src/server/imports.js') + '');
var Physics = require('./Physics');
var GameServer = require('./GameServer');


module.exports = function(){
    Physics.startWorld(GameServer.sendAllInitialObjects);
    setInterval(Physics.update, 1000 / 60);
    setInterval(Physics.updateWorld.bind(GameServer,null,GameServer.updateWorld), 1000*6 / 60);
}



