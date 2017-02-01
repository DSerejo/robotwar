
global.Box2D = require('../../engine/external/box2d/box2d');
var fs = require('fs');
eval(fs.readFileSync('./public/src/server/imports.js') + '');
var Physics = require('./Physics');
var GameServer = require('./GameServer');

Physics.startWorld();

setInterval(Physics.update, 1000 / 60);

// Send world update to client every 32 ms
setInterval(Physics.updateWorld.bind(GameServer,null,GameServer.updateWorld), 1000*4 / 60);



