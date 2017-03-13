var express = require('express');
var app = express();
var server = require('http').createServer(app);
var usage = require('pidusage');

var ConnectionManager = require('./public/src/server/ConnectionManager');


io = require('socket.io').listen(server);


app.set('port', (process.env.PORT || 5001));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    response.render('pages/server');
});

var pid = process.pid; // you can use any valid PID instead

//setInterval(function(){
//    usage.stat(pid,{keepHistory:true}, function(err, result) {
//        console.log(pid,result.cpu,result.memory/1000000);
//        global.gc();
//    });
//},3000);


server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
new ConnectionManager(io);




