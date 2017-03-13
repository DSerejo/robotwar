
var WorldLayer = cc.Layer.extend({
    objects:[],
    staticObjects:[],
    objectsLayer:null,
    graveyard:{},
    stopped:true,
    currentState:{},
    jointObjects :['pin'],
    ctor:function(initialObjects){
        this._super();
        this.objectsLayer = new cc.Layer();
        this.addChild(this.objectsLayer);
        this.setAnchorPoint(0,0);
        this.initWorld(initialObjects);

        setInterval(this.update.bind(this),1000/60);
    },
    lastUpdate:null,
    update:function(){
        this.worldManager.world.DrawDebugData();
        if(this.stopped) return;
        this.worldManager.world.Step(1/60,10,10);
        this.worldManager.world.ClearForces();
        this.entityManager.removeDeadBodies();
        this.entityManager.updateAll()
    },
    getDeltaTime: function(){
        var now = new Date().getTime(),
            dt = this.lastUpdate?(now - this.lastUpdate)/1000:1/60;
        this.lastUpdate = now;
        return dt;
    },
    initObjects:function(listOfObjects){
        var self = this;
        listOfObjects.forEach(function(object){
            var newObject = Factory[object.class](object);
            self.objects.push(newObject);
            newObject.class = object.class;
            if(newObject.sprite)
                self.objectsLayer.addChild(newObject.sprite,object.class=='pin'?2:0);
        })
    },
    initWorld:function(initialObjects){
        this.entityManager = new EntityManager();
        this.factory = new Factory(this.entityManager);
        this.worldManager = new World(this.factory);
        this.factory.setWorld(this.worldManager.world);
        this.worldManager.setupWorld();
        this.worldManager.debugDraw();
        this.world = this.worldManager.world;
        this.addObjects(initialObjects);
        this.startListenningContacts()
    },
    updateWorld:function(){
        this.worldManager.clearAllStatic();
        this.worldManager.debugDraw();
        this.worldManager.setupWorld()
    },
    addObjects:function(objects){
        var self = this;
        this.worldManager.setInitialObjects(objects,function(object){
            self.objects.push(object);
            if(object.sprite)
                self.objectsLayer.addChild(object.sprite,object.type==Entity.types.pin?2:0);
        });
    },
    addObject:function(object){
        var entity =this.worldManager.createEntityFromOptions(object);
        if(this.jointObjects.indexOf(object.class)>=0){
            this.entityManager.addNewJoint(entity);
        }else{
            this.entityManager.addNewEntity(entity);
        }
        this.objects.push(entity);
        if(entity.sprite)
            this.objectsLayer.addChild(entity.sprite,entity.type==Entity.types.pin?2:0);
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
        this.updateWorld([]);
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
        new ContactListener(this,this.world,this.entityManager);
    },
    removeDeadBodies:function(){
        _.each(this.graveyard,function(o,i,g){
            o.removeFromParent();
            delete g[i];
        })
    },
    getBodyWithId:function(id){
        var world = this.world;
        var curBody = world.GetBodyList(),
            maxTries = world.GetBodyCount();
        while(curBody.GetUserData()!=id && maxTries>0){
            curBody = curBody.GetNext()
        }
        if(curBody.GetUserData()==id)
            return curBody
    },
    run:function(){
        this.saveCurrentState();
        this.stopped = false;
    },
    saveCurrentState(){
        this.currentState = JSON.parse(JSON.stringify(this.worldManager.getCurrentState()));
    },
    save(){
        this.saveCurrentState();
        window.localStorage['robot_' + window.robotName] = JSON.stringify(this.currentState);
    },
    restart:function(){
        this.stopped = true;
        this.currentSelectedId = this.parent.selectedObject?this.parent.selectedObject.id:null;
        this.worldManager.clearAllDynamic();
        this.objects = [];
        this.parent.setAllObjectsToInactive();
        this.addObjects(this.currentState);
        if(this.currentSelectedId){
            this.parent.setSelectedObject(this.currentSelectedId)
        }
    },
    undo:function(){
        this.currentState = EditorState.prevState();
        this.restart();
    },
    redo:function(){
        this.currentState = EditorState.nextState();
        this.restart();
    }
});
var DamageHandler = cc.Class.extend({
    world:null,
    entityManager:null,
    ctor:function(world,entityManager){
        this.world = world;
        this.entityManager = entityManager
    },
    updateKineticEnergy(obj1,obj2){
        obj1.updateKineticEnergy && obj1.updateKineticEnergy();
        obj2.updateKineticEnergy && obj2.updateKineticEnergy();
    },
    checkAndApplyDamage(obj1,obj2,contact,impulse){
        if(!obj1.body || !obj2.body) return;
        const impactForce = this.calculateImpactForce(obj1,obj2,impulse),
            impactArea = this.calculateImpactArea(contact),
            stress = [impactForce[0]/impactArea,contact.m_manifold.m_pointCount==2?impactForce[1]/impactArea:0],
            worldManifold = new b2WorldManifold();

        contact.GetWorldManifold(worldManifold);

        this.updateDamage(obj1,obj2,stress,worldManifold);
        this.checkDeadBodies(obj1,obj2)
    },
    calculateImpactArea(contact){
        if(contact.m_manifold.m_pointCount==1){
            return 0.1;
        }else{
            return cc.pDistance(contact.m_manifold.m_points[0].m_localPoint,contact.m_manifold.m_points[1].m_localPoint);
        }
    },
    calculateImpactForce(obj1,obj2,impulse){
        var restitution = Box2D.Common.b2Settings.b2MixRestitution(obj1.body.GetFixtureList().m_restitution,obj2.body.GetFixtureList().m_restitution),
            factor = (1-restitution)/(1+restitution);
        return [impulse.normalImpulses[0]*this.world.m_inv_dt0*factor,impulse.normalImpulses[0]*this.world.m_inv_dt0*factor] ;
    },
    getDiffEnergy:function(obj1, obj2){
        var obj1DiffEnergy = obj1.getDiffEnergy?obj1.getDiffEnergy(): 0,
            obj2DiffEnergy = obj2.getDiffEnergy?obj2.getDiffEnergy(): 0;
        return obj1DiffEnergy + obj2DiffEnergy;
    },
    updateDamage:function(obj1,obj2,stress,worldManifold){
        var appliedStress1 = obj1.calculateAppliedStress(stress,worldManifold);
        if(appliedStress1[1][0]>0){

        }
        var appliedStress2 = obj2.calculateAppliedStress(stress,worldManifold);

        obj1.calculateAndApplyDamage && obj1.calculateAndApplyDamage(stress,worldManifold);
        obj2.calculateAndApplyDamage && obj2.calculateAndApplyDamage(stress,worldManifold);
    },
    checkDeadBodies:function(obj1,obj2){
        if(obj1.life && obj1.life<0 &&  !this.entityManager.graveyard[obj1.id]) this.entityManager.graveyard[obj1.id] = obj1;
        if(obj2.life && obj2.life<0 &&  !this.entityManager.graveyard[obj2.id]) this.entityManager.graveyard[obj2.id] = obj2;
    },

});
var ContactListener = cc.Class.extend({
    _this:null,
    world:null,
    damageHandler:null,
    ctor:function(layer,world,entityManager){
        var listener = new b2ContactListener();
        listener.PreSolve = this.PreSolve.bind(this);
        listener.PostSolve = this.PostSolve.bind(this);
        world.SetContactListener(listener);
        this.damageHandler = new DamageHandler(world,entityManager);
        this.world = world;
        this.layer = layer;
    },
    PreSolve:function (contact, oldManifold) {
        var body1 = contact.GetFixtureA().GetBody(),
            body2 = contact.GetFixtureB().GetBody(),
            obj1 = body1.GetUserData(),
            obj2 = body2.GetUserData();
        this.damageHandler.updateKineticEnergy(obj1,obj2);
    },
    PostSolve:function (contact, impulse) {
        if(impulse.normalImpulses[0]>1){
            var obj1 = contact.GetFixtureA().GetBody().GetUserData(),
                obj2 = contact.GetFixtureB().GetBody().GetUserData();
            this.damageHandler.checkAndApplyDamage(obj1,obj2,contact,impulse);
            //console.log(impulse.normalImpulses[0]*2*60);
            //console.log(obj1.id,obj2.id,contact.m_manifold.m_pointCount,impulse.normalImpulses);
        }
    },
    deepClone:function(obj){
        return JSON.parse(JSON.stringify(obj));
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


});

