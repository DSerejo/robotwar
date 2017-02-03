var WorldManager = new World(Factory);
var stepCount = 0;
var BattleScene = cc.Scene.extend({
    stopped:false,
    socket: null,
    actionKeys:{},
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));
        this.addChild(background,-1,BattleScene.Tags.background);
        WorldManager.setupWorld();
        WorldManager.debugDraw();
        window.setInterval(this.update.bind(this), 1000 / 60);
        this.listenEvents()
    },
    update:function(){
        World.world.DrawDebugData();
        if(this.stopped) return;
        World.world.Step(1/60,10,10);
        World.world.ClearForces();
        EntityManager.removeDeadBodies();
        EntityManager.updateAll()
    },
    updateWorld:function(data,t){
        var world = World.world;
        var body = world.GetBodyList();
        do {
            var userData = body.GetUserData();
            if(userData && userData.id && data[userData.id]){
                var update = data[userData.id];
                body.SetAwake(true);
                body.SetPosition(update.p);
                body.SetLinearVelocity(update.lv);
                body.SetAngularVelocity(update.av);
                body.SetAngle(update.a);
                var dt = (new Date()).getTime() +  - t

                if(typeof diffTimestamp != 'undefined'){
                    dt = dt + diffTimestamp;

                    if(Math.abs(diffTimestamp - 2000) < 10){
                        var previousState = this.previousBodyState(dt,body);
                        if(Math.abs(cc.pLength(previousState.p) - cc.pLength(update.p))>0.3){
                            var newAngle1 = update.a + update.av*dt/1000;
                            var newP = cc.pAdd(update.p,cc.pMult(update.lv,dt/1000));
                            //body.SetPosition(newP);
                            //body.SetLinearVelocity(update.lv);
                            //body.SetAngularVelocity(update.av);
                            //body.SetAngle(newAngle1);
                            //console.log(dt,previousState,update);
                        }
                    }
                }
            }
        } while (body = body.GetNext());
    },
    previousBodyState:function(dt,body){
        return {
            p:cc.pSub(body.GetPosition(),cc.pMult(body.GetLinearVelocity(),dt/1000)),
            a:body.GetAngle() - body.GetAngularVelocity()*dt/1000
        }
    },
    startObjects:function(data){
        var self = this;
        WorldManager.clearAllDynamic();
        WorldManager.setInitialObjects(data,function(o){
            o.sprite && self.addChild(o.sprite)
        });
        stepCount = 0;
    },
    listenEvents:function(){
        var self = this
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key,event){
                var objects = EntityManager.actionKeys[key]
                if(objects&& objects.length){
                    self.socket.emit('message',{m:'keyPressed',d:key})
                }
                //_.each(objects,function(o){
                //    o && o.onKeyPressed && o.onKeyPressed(key,event)
                //})
            },
            onKeyReleased:function(key,event){
                var objects = EntityManager.actionKeys[key]
                if(objects&& objects.length){
                    self.socket.emit('message',{m:'keyReleased',d:key})
                }
                //_.each(objects,function(o){
                //    o && o.onKeyReleased && o.onKeyReleased(key,event)
                //})
            }
        },this)
    }


});

BattleScene.Tags = {
    background:1
};
