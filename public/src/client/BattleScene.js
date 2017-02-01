var WorldManager = new World(Factory)
var BattleScene = cc.Scene.extend({
    stopped:false,
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));
        this.addChild(background,-1,BattleScene.Tags.background);
        WorldManager.setupWorld();
        WorldManager.debugDraw();
        window.setInterval(this.update.bind(this), 1000 / 60);
    },
    update:function(){
        var world = World.world;
        world.DrawDebugData();
        if(this.stopped) return;
        world.Step(1 / 60, 10, 10);
        world.ClearForces();
        EntityManager.updateAll();
    },
    updateWorld:function(data,t){
        var world = World.world
        var body = world.GetBodyList();
        do {
            var userData = body.GetUserData();
            if(userData && userData.id && data[userData.id]){
                var update = data[userData.id];

                var dt = (new Date()).getTime() - t,
                    newAngle = update.a + update.av*dt/1000,
                    newP = cc.pAdd(update.p,cc.pMult(update.lv,dt/1000));
                body.SetAwake(true);
                if(Math.abs(cc.pLength(newP) - cc.pLength(body.GetPosition()))>0.3 ||
                    Math.abs(newAngle - body.GetAngle()) > 0.08 )
                {
                    body.SetPositionAndAngle(newP,newAngle);
                    console.log('correcting');
                }
                body.SetLinearVelocity(update.lv);
                body.SetAngularVelocity(update.av);
            }
        } while (body = body.GetNext());
    },
    startObjects:function(data){
        var self = this;
        WorldManager.clearAllDynamic();
        WorldManager.setInitialObjects(data,function(o){
            o.sprite && self.addChild(o.sprite)
        });
    }

});

BattleScene.Tags = {
    background:1
}
