'use strict';
import {cc} from '../cc.js'

class ConnectionManager {
    constructor(){
        this.scene = null;
        this.socket = io.connect(xhost + xport);
        this.socket.on('connect',this.onConnect.bind(this));
        this.socket.on('disconnect',this.onDisconnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    }
    setScene(scene){
        this.scene = scene;
    }
    callSceneFunc(func,args){
        this.scene && this.scene[func] && this.scene[func].apply(this.scene,args)
    }
    onConnect(){
            this.callSceneFunc('onConnect');
    }
    onDisconnect() {
        this.callSceneFunc('onDisconnect');
    }
    sendMessage(event,data){
        this.socket.emit('message',{m:event,d:JSON.stringify(data)});
    }
    onMessage(packet) {
        packet = JSON.parse(packet);
        this.callSceneFunc('onMessage',[packet]);
    }
}

export default ConnectionManager;
//setInterval(function(){
//    socket.emit('message',{m:'ping',d:new Date().getTime()});
//},1000)
//socket.emit('message',{m:'ping',d:new Date().getTime()});