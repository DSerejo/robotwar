var ConnectionManager = cc.Class.extend({
    socket:null,
    scene:null,
    ctor:function(){
        this.socket = io.connect(xhost + xport);
        this.socket.on('connect',this.onConnect.bind(this));
        this.socket.on('disconnect',this.onDisconnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    },
    setScene(scene){
        this.scene = scene;
    },
    callSceneFunc:function(func,args){
        this.scene && this.scene[func] && this.scene[func].apply(this.scene,args)
    },
    onConnect:function(){
        this.callSceneFunc('onConnect');
    },
    onDisconnect:function() {
        this.callSceneFunc('onDisconnect');
    },
    sendMessage:function(event,data){
        this.socket.emit('message',{m:event,d:JSON.stringify(data)});
    },
    onMessage:function(packet) {
        packet = JSON.parse(packet);
        this.callSceneFunc('onMessage',[packet]);
    }
});

//setInterval(function(){
//    socket.emit('message',{m:'ping',d:new Date().getTime()});
//},1000)
//socket.emit('message',{m:'ping',d:new Date().getTime()});