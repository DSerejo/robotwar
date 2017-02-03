var WorldLayer = cc.Layer.extend({
    objects:[],
    staticObjects:[],
    objectsLayer:null,
    graveyard:{},
    stopped:false,
    ctor:function(initialObjects){
        this._super()
        this.objectsLayer = new cc.Layer();
        this.addChild(this.objectsLayer);
        this.setAnchorPoint(0,0);
        this.initWorld(initialObjects);
        setInterval(this.update.bind(this),1000/60);
    },
    lastUpdate:null,
    update:function(){
        World.world.DrawDebugData();
        if(this.stopped) return;
        World.world.Step(1/60,10,10);
        World.world.ClearForces();
        EntityManager.removeDeadBodies();
        EntityManager.updateAll()
    },
    getDeltaTime: function(){
        var now = new Date().getTime(),
            dt = this.lastUpdate?(now - this.lastUpdate)/1000:1/60;
        this.lastUpdate = now;
        return dt;
    },
    initObjects:function(listOfObjects){
        var self = this
        listOfObjects.forEach(function(object){
            var newObject = Factory[object.class](object)
            self.objects.push(newObject)
            newObject.class = object.class
            if(newObject.sprite)
                self.objectsLayer.addChild(newObject.sprite,object.class=='pin'?2:0);
        })
    },
    initWorld:function(initialObjects){
        this.worldManager = new World(Factory);
        this.worldManager.debugDraw()
        this.worldManager.setupWorld()
        var self = this;
        this.worldManager.setInitialObjects(initialObjects,function(object){
            self.objects.push(object)
            if(object.sprite)
                self.objectsLayer.addChild(object.sprite,object.type==Entity.types.pin?2:0);
        })
        //this.startListenningContacts()
    },
    createGround:function(){
        var pos = cc.p((cc.view.getDesignResolutionSize().width/2)/WORLD_SCALE,0),
            size = cc.pToSize(cc.pMult(cc.p(cc.view.getDesignResolutionSize().width*20,10),WORLD_SCALE));
        this.staticObjects.push(this.createStaticBoxBody(pos,size,'ground'));
    },
    clearWorld:function(){
        for(var i = 0;i<this.staticObjects.length;i++){
            this.world.DestroyBody(this.staticObjects[i]);
            this.staticObjects.splice(i,1);
        }
    },
    scaleWorld:function(scale){
        WORLD_SCALE = scale;
        UPDATE_PMR();
        this.objects.forEach(function(object){
            object.updateBodyFromSprite();
        });
        this.initWorld();
        this.setScale(scale)

    },
    debugDraw:function(){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
        debugDraw.SetDrawScale(PMR);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    },
    startListenningContacts:function(){
        new ContactListener(this.world,this);
    },
    removeDeadBodies:function(){
        _.each(this.graveyard,function(o,i,g){
            o.removeFromParent()
            delete g[i];
        })
    },
    getBodyWithId:function(id){
        var world = this.world
        var curBody = world.GetBodyList(),
            maxTries = world.GetBodyCount()
        while(curBody.GetUserData()!=id && maxTries>0){
            curBody = curBody.GetNext()
        }
        if(curBody.GetUserData()==id)
            return curBody
    }
})

var ContactListener = cc.Class.extend({
    _this:null,
    world:null,
    ctor:function(world,layer){
        var listener = new b2ContactListener();
        listener.PreSolve = this.PreSolve.bind(this);
        listener.PostSolve = this.PostSolve.bind(this);
        world.SetContactListener(listener);
        this.world = world
        this.layer = layer;
    },
    PreSolve:function (contact, oldManifold) {
        var body1 = contact.GetFixtureA().GetBody(),
            body2 = contact.GetFixtureB().GetBody(),
            obj1 = body1.GetUserData(),
            obj2 = body2.GetUserData()
        obj1.updateKineticEnergy && obj1.updateKineticEnergy();
        obj2.updateKineticEnergy && obj2.updateKineticEnergy();
    },
    PostSolve:function (contact, impulse) {
        if(impulse.normalImpulses[0]>1){
            var obj1 = contact.GetFixtureA().GetBody().GetUserData(),
                obj2 = contact.GetFixtureB().GetBody().GetUserData(),
                diffEnergy = this.getDiffEnergy(obj1,obj2);
            this.updateDamage(obj1,obj2,diffEnergy);
            this.checkDeadBodies(obj1,obj2)
        }
    },
    getDiffEnergy:function(obj1, obj2){
        var obj1DiffEnergy = obj1.getDiffEnergy?obj1.getDiffEnergy(): 0,
            obj2DiffEnergy = obj2.getDiffEnergy?obj2.getDiffEnergy(): 0
        return obj1DiffEnergy + obj2DiffEnergy;
    },
    updateDamage:function(obj1,obj2,diffEnergy){
        obj1.calculateDamage && obj1.calculateDamage(diffEnergy);
        obj2.calculateDamage && obj2.calculateDamage(diffEnergy);
    },
    checkDeadBodies:function(obj1,obj2){
        if(obj1.life && obj1.life<0 &&  !this.layer.graveyard[obj1.__instanceId]) this.layer.graveyard[obj1.__instanceId] = obj1;
        if(obj2.life && obj2.life<0 &&  !this.layer.graveyard[obj2.__instanceId]) this.layer.graveyard[obj2.__instanceId] = obj2;
    },
    applyCorrectorImpulses:function(obj1,obj2,contact,impulse){
        if(obj1 != 'ground' && obj2 != 'ground'){
            var worldManifold = new b2WorldManifold(),
                normal;
            contact.GetWorldManifold(worldManifold);
            if( obj1.life>0 && obj2.life<=0){
                obj1.updateImpulseCorrector(worldManifold,worldManifold.m_normal,impulse,obj2.correctImpulseRateAfterDestruction())
            }
            if(obj2.life>0 && obj1.life<=0){
                obj2.updateImpulseCorrector(worldManifold,worldManifold.m_normal,impulse,obj1.correctImpulseRateAfterDestruction())
            }
        }
    }

})

