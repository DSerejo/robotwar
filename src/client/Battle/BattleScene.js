'use strict';
import {cc} from '../../constants.js';
import BattleEntitiesLayer from './BattleEntitiesLayer';
import {mix} from "../../../tools/mixwith/mixwith.js";
import {MessageListenerMixin} from "../../common/helpers/MessageListener.js";
class BattleScene extends mix(cc.Scene).with(MessageListenerMixin){
    constructor(director,room){
        super();
        this.restartEntitiesLayer();
        this.director = director;
        this.socket = director.connectionManager.socket;
        this.room = room;
        this.stopped = false
        this.actionKeys = {}
        this.restartEntitiesLayer();

    }
    restartEntitiesLayer(){
        this.battleEntitiesLayer && this.battleEntitiesLayer.removeFromParent();
        this.battleEntitiesLayer && this.battleEntitiesLayer.destroy();
        this.battleEntitiesLayer = new BattleEntitiesLayer();
        var backgroundLayer;
        backgroundLayer = new cc.LayerColor(cc.color(255,255,255));
        this.addChild(backgroundLayer,-1,BattleScene.Tags.background);
        this.addChild(this.battleEntitiesLayer,-1,BattleScene.Tags.entities);
        this.battleEntitiesLayer.setAnchorPoint(0.5,0.5);
        this.battleEntitiesLayer.scaleWorld(0.3);
    }
    onEnter () {
        this.listenEvents();
    }
    setConnectionManager(connection){
        this.connection = connection;
    }
    onWorldUpdate(packet){
         this.battleEntitiesLayer.updateWorld(packet.d, packet.t);
    }
    onWorldStart(packet){
        console.log(packet);
        this.battleEntitiesLayer.startObjects(packet.d, packet.t);
    }
    onGameClosed(packet){
        this.director.endGame(packet.d)
    }
    onDisconnect(){
        this.director.endGame('lostConnection');
    }
    listenEvents(){
        var self = this;
        var listener = cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed(key,event){
                var objects = self.battleEntitiesLayer.entityManager.actionKeys[key]
                if(objects&& objects.length){
                    self.socket.emit('message',self.room,{m:'keyPressed',d:key})
                }
                //_.each(objects,function(o){
                //    o && o.onKeyPressed && o.onKeyPressed(key,event)
                //})
            },
            onKeyReleased(key,event){
                var objects = self.battleEntitiesLayer.entityManager.actionKeys[key];
                if(objects&& objects.length){
                    self.socket.emit('message',self.room,{m:'keyReleased',d:key})
                }
                //_.each(objects,function(o){
                //    o && o.onKeyReleased && o.onKeyReleased(key,event)
                //})
            }
        },this);
        listener._setPaused(false);
    }

};
BattleScene.prototype.acceptableMessages = {
    'world-update':'onWorldUpdate',
    'world-start':'onWorldStart',
    'gameClosed':'onGameClosed'
}

BattleScene.Tags = {
    background:1,
    entities:2
};
module.exports = BattleScene;