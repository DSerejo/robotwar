

var stepCount = 0;
var BattleEntitiesLayer = cc.Layer.extend({
    worldManager:null,
    entityManager:null,
    factor:null,
    updateInterval:null,
    ctor(){
        this._super();
        this.entityManager = new EntityManager();
        this.factory = new Factory(this.entityManager);
        this.worldManager = new World(this.factory);
        this.factory.setWorld(this.worldManager.world);
        this.worldManager.setupWorld();
        //this.worldManager.debugDraw();
        this.updateInterval = window.setInterval(this.update.bind(this), 1000 / 60);
    },
    destroy:function(){
        clearInterval(this.updateInterval);
    },
    update:function(){
        this.worldManager.world.DrawDebugData();
        if(this.stopped) return;
        this.worldManager.world.Step(1/60,10,10);
        this.worldManager.world.ClearForces();
        this.entityManager.removeDeadBodies();
        this.entityManager.updateAll()
    },
    updateWorld:function(data,t){
        var world = this.worldManager.world;
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
        this.worldManager.clearAllDynamic();
        this.worldManager.setInitialObjects(data,function(o){
            o.sprite && self.addChild(o.sprite)
        });
        stepCount = 0;
    },

});