var express = require('express');
var app = express();
var server = require('http').createServer(app);

require('./public/src/server/index');

var ClientManager = require('./public/src/server/ClientManager');
var GameServer = require('./public/src/server/GameServer');

io = require('socket.io').listen(server);


app.set('port', (process.env.PORT || 5001));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    response.render('pages/server');
});

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

io.sockets.on('connection', function(client) {
    ClientManager.addClient(client);
    GameServer.sendInitialObjects(client);
    client.on('message', GameServer.onMessage.bind(GameServer,client));
    client.on('disconnect', function(){
        ClientManager.removeClient(client);
    });
});


