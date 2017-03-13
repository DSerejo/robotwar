
var BattleScene = cc.Scene.extend({
    stopped:false,
    socket: null,
    actionKeys:{},
    battleEntitiesLayer:null,
    director:null,
    room:null,
    ctor:function(director,room){
        this._super();
        this.restartEntitiesLayer();
        this.director = director;
        this.socket = director.connectionManager.socket;
        this.room = room;

    },
    restartEntitiesLayer:function(){
        this.battleEntitiesLayer && this.battleEntitiesLayer.removeFromParent();
        this.battleEntitiesLayer && this.battleEntitiesLayer.destroy();
        this.battleEntitiesLayer = new BattleEntitiesLayer();
        var backgroundLayer;
        backgroundLayer = new cc.LayerColor(cc.color(255,255,255));
        this.addChild(backgroundLayer,-1,BattleScene.Tags.background);
        this.addChild(this.battleEntitiesLayer,-1,BattleScene.Tags.entities);
    },
    onEnter:function () {
        this.listenEvents();
    },
    setConnectionManager:function(connection){
        this.connection = connection;
    },
    onMessage:function(packet){
        if (packet && packet.m && BattleScene.acceptableMessages[packet.m])
            this[BattleScene.acceptableMessages[packet.m]](packet);
    },
    onWorldUpdate:function(packet){
         this.battleEntitiesLayer.updateWorld(packet.d, packet.t);
    },
    onWorldStart:function(packet){
        this.battleEntitiesLayer.startObjects(packet.d, packet.t);
    },
    onGameClosed:function(packet){
        this.director.endGame(packet.d)
    },
    onDisconnect:function(){
        this.director.endGame('lostConnection');
    },
    listenEvents:function(){
        var self = this;
        var listener = cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key,event){
                var objects = self.battleEntitiesLayer.entityManager.actionKeys[key]
                if(objects&& objects.length){
                    self.socket.emit('message',self.room,{m:'keyPressed',d:key})
                }
                //_.each(objects,function(o){
                //    o && o.onKeyPressed && o.onKeyPressed(key,event)
                //})
            },
            onKeyReleased:function(key,event){
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

});
BattleScene.acceptableMessages = {
    'world-update':'onWorldUpdate',
    'world-start':'onWorldStart',
    'gameClosed':'onGameClosed'
}

BattleScene.Tags = {
    background:1,
    entities:2
};
