
global.Box2D = require('../../../../external/box2d/box2d');
var fs = require('fs')
eval(fs.readFileSync('imports.js') + '');
var http = require('http'),
    io = require('socket.io'),
    Materials = require('../common/Physics/Materials'),
    EntityFactory = require('../common/Physics/EntityFactory');
    EntityManager = require('../common/Physics/EntityManager');
    World = require('../common/World');
    TestScenes = require('../client/Editor/TestScenes');
    _ = require('lodash');






var clients = [];
var worldManager = new World(EntityFactory);
worldManager.setupWorld(TestScenes.running);
var world = World.world

function update() {
    world.Step(1 / 60, 10, 10);
    world.ClearForces();
}

function updateWorld(client) {

    var body = world.GetBodyList();
    var update = {};
    var isUpdateNeeded = false;

    do {
        var userData = body.GetUserData();

        if(userData && userData.id && body.IsAwake()){
            update[userData.id] = {
                p: body.GetPosition(),
                a: body.GetAngle(),
                lv: body.GetLinearVelocity(),
                av: body.GetAngularVelocity()
            };
            isUpdateNeeded = true;
        }
    } while (body = body.GetNext());


    if(isUpdateNeeded) {
        sendToClients('world-update', update, null);
    }
}

function updateWithBodies(bodies) {

    var update = {};
    var isUpdateNeeded = false;

    for(var b in bodies) {
        var body = bodies[b];

        //console.log(body);

        var userData = body.GetUserData();

        if(userData && userData.bodyId && body.IsAwake()){
            update[userData.bodyId] = {
                p: body.GetPosition(),
                a: body.GetAngle(),
                lv: body.GetLinearVelocity(),
                av: body.GetAngularVelocity()
            };
            isUpdateNeeded = true;
        }
    }


    if(isUpdateNeeded) {
        sendToClients('world-update', update);
    }
}

function sendToClients(message, data, except) {
    var packet = {
        m: message,
        d: data
    }
    for (var i = 0; i < clients.length; i++) {
        if(clients[i] != except) {
            packet.t = (new Date()).getTime();
            clients[i].send(JSON.stringify(packet));
        }
    }
}

function pong(client, data) {
    var packet = {
        m: 'pong',
        d: data
    }
    client.send(JSON.stringify(packet));
}

// Set Gravity here

//world.SetContactListener(createCollisionDetector());

// Box2D Engine step configuration

setTimeout(function(){
    setInterval(update, 1000 / 60);

// Send world update to client every 32 ms
    setInterval(updateWorld, 1000*4 / 60);
},1000)



// Setting up socket
var server = http.createServer(
    function(req, res){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Box2D Network Testing</h1>');
    }
);


server.listen(8003,'127.0.0.1');
console.log('Starting socket server on port port %d', 8003);
var socket = io.listen(server);

function getBodies(){
    var body = world.GetBodyList(),
        bodies = [];

    do {
        var userData = body.GetUserData();

        if(userData && userData.id && body.IsAwake()){
            bodies.push(userData.toObject());
        }
    } while (body = body.GetNext());
    return bodies;
}
function getJoints(){
    var joints = [];

    _.each(EntityManager.joints,function(joint,id){
        if(joint.joint){
            joints.push(joint.toObject());
        }
    });
    return joints;
}
function sendInitialObjects(client){
    var packet = {
        m:'world-start',
        d:{bodies:getBodies(),joints:getJoints()}
    }
    console.log(JSON.stringify(packet));
    client.send(JSON.stringify(packet));
}
socket.on('connection', function(client) {
    clients.push(client);
    console.log("Total clients: " + clients.length);

    client.send(JSON.stringify({"startId" : clients.length}));
    sendInitialObjects(client);
    client.on('message', function(packet){
        packet = JSON.parse(packet);

        if(packet && packet.m){
            switch(packet.m){
                case 'jump':
                    jump();
                    updateWorld(client);
                    break;
                case 'ping':
                    pong(client, packet.d);
                    break;
                default:
                    break;
            }
        }
        //updateWorld();
    });

    client.on('disconnect', function(){
        clients.splice(clients.indexOf(client),1)
    });
});

