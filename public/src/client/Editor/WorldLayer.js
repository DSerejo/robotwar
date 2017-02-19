
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
        this.worldManager = new World(Factory);
        this.worldManager.debugDraw();
        this.worldManager.setupWorld();
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
            EntityManager.addNewJoint(entity);
        }else{
            EntityManager.addNewEntity(entity);
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
        new ContactListener(this);
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
        this.currentState = JSON.parse(JSON.stringify(World.getCurrentState()));
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
    updateKineticEnergy(obj1,obj2){
        obj1.updateKineticEnergy && obj1.updateKineticEnergy();
        obj2.updateKineticEnergy && obj2.updateKineticEnergy();
    },
    checkAndApplyDamage(obj1,obj2,contact,impulse){
        const impactForce = this.calculateImpactForce(obj1,obj2,impulse),
            impactArea = this.calculateImpactArea(contact),
            stress = impactForce/impactArea;
        //
        //const diffEnergy = this.getDiffEnergy(obj1,obj2),
        //    absorbedEnergies = this.getAbsorbedEnergyPerObject(obj1,obj2,diffEnergy);
        this.updateDamage(obj1,obj2,stress);
        //this.checkDeadBodies(obj1,obj2)
    },
    calculateImpactArea(contact){
        if(contact.m_manifold.m_pointCount==1){
            return 0.1;
        }else{
            return cc.pDistance(contact.m_manifold.m_points[0].m_localPoint,contact.m_manifold.m_points[1].m_localPoint);
        }
    },
    calculateImpactForce(obj1,obj2,impulse){
        var restitution = Box2D.Common.b2Settings.b2MixRestitution(obj1.material.restitution,obj2.material.restitution),
            totalImpulse = impulse.normalImpulses[0]+impulse.normalImpulses[1],
            forceResult = totalImpulse*World.world.m_inv_dt0;
        return forceResult * ((1-restitution)/2 + restitution);
    },

    getAbsorbedEnergyPerObject(obj1,obj2,energy){
        var obj1Absorption = 1 - obj1.material.restitution,
            obj2Absorption = 1 - obj2.material.restitution;
        return {
            obj1: energy * obj1Absorption / (obj1Absorption+obj2Absorption),
            obj2: energy * obj2Absorption / (obj1Absorption+obj2Absorption),
        }
    },
    getDiffEnergy:function(obj1, obj2){
        var obj1DiffEnergy = obj1.getDiffEnergy?obj1.getDiffEnergy(): 0,
            obj2DiffEnergy = obj2.getDiffEnergy?obj2.getDiffEnergy(): 0;
        return obj1DiffEnergy + obj2DiffEnergy;
    },
    updateDamage:function(obj1,obj2,stress){
        obj1.calculateAndApplyDamage && obj1.calculateAndApplyDamage(stress);
        obj2.calculateAndApplyDamage && obj2.calculateAndApplyDamage(stress);
    },
    checkDeadBodies:function(obj1,obj2){
        if(obj1.life && obj1.life<0 &&  !this.layer.graveyard[obj1.__instanceId]) this.layer.graveyard[obj1.__instanceId] = obj1;
        if(obj2.life && obj2.life<0 &&  !this.layer.graveyard[obj2.__instanceId]) this.layer.graveyard[obj2.__instanceId] = obj2;
    },

});
var ContactListener = cc.Class.extend({
    _this:null,
    world:null,
    damageHandler:null,
    ctor:function(layer){
        const world = World.world;
        var listener = new b2ContactListener();
        listener.PreSolve = this.PreSolve.bind(this);
        listener.PostSolve = this.PostSolve.bind(this);
        world.SetContactListener(listener);
        this.damageHandler = new DamageHandler();
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

