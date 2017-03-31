
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var BoxBody =  require('./Physics/BoxBody');
    var EntityManager =  require('./Physics/EntityManager');
    var Materials =  require('./Physics/Materials');
    var ContactListener =  require('./Physics/ContactListener');
    var _ =  require('lodash');
}

var World = function(entityFactory,listenContacts){
    this.entityFactory = entityFactory;
    this.entityManager = this.entityFactory.entityManager;
    this.world = new b2World(gravity);
    this.world.SetContinuousPhysics(true);
    this.staticObjects = [];
    this.entityFactory.setWorld(this.world);
    if(listenContacts)
        this.startListenningContacts();

};
World.prototype.DrawDebugData = function(){
    this.world.DrawDebugData();
    var c;
    for (c = this.world.m_contactList;
         c; c = c.m_next) {
        if(c.m_manifold.m_pointCount==0)
            continue;
        var wm = new b2WorldManifold();
        c.GetWorldManifold(wm);
        this.world.m_debugDraw.DrawCircle(wm.m_points[0],0.05,'#2ef7bb');
        if(c.m_manifold.m_pointCount==2){
            this.world.m_debugDraw.DrawCircle(wm.m_points[1],0.05,'#2ef7bb');
        }
    }
}
World.prototype.setupWorld = function(initialObjects,withSprite){
    this.createGround(withSprite);
    initialObjects && this.setInitialObjects(initialObjects);
};

World.prototype.clearAllDynamic = function(){
    _.each(this.entityManager.entities,function(o){
        o.remove();
    });
    _.each(this.entityManager.joints,function(o){
        o.remove();
    });
    this.entityManager.entities = {};
    this.entityManager.joints = {}

};
World.prototype.clearAllStatic = function(){
    for(var i = 0;i<this.staticObjects.length;i++){
        if(this.staticObjects[i].remove)
            this.staticObjects[i].remove();
        else
            this.world.DestroyBody(this.staticObjects[i].body);
        this.staticObjects.splice(i,1);
    }

};
World.prototype.createEntityFromOptions = function(o){
    return this.entityFactory[o.class](o);
};
World.prototype.setInitialObjects = function(initialObjects,callback){
    var self = this;
    console.log(JSON.stringify(this.getCurrentState()));
    _.each(initialObjects.bodies,function(o){
        if(!o || (o.id && self.entityManager.hasEntityId(o.id))) return;
        var entity = self.createEntityFromOptions(o);
        if(o.lv){
            entity.body.SetLinearVelocity(o.lv)
            entity.body.SetAngularVelocity(o.av)
        }
        callback && callback(entity);
        self.entityManager.addNewEntity(entity);
    });
    _.each(initialObjects.joints,function(o){
        if(!o || (o.id && self.entityManager.hasEntityId(o.id))) return;
        var entity = self.entityFactory[o.class](o);
        callback && callback(entity);
        self.entityManager.addNewJoint(entity);
    });
};
World.prototype.createGround=function(withSprite){
    var pos = cc.p(0,0),
        size = cc.size(100,0.3);
    this.staticObjects.push(this.createStaticBoxBody(pos,size,'ground',withSprite));
};
World.prototype.createStaticBoxBody = function(pos,size,id,withSprite){
    var boxBody;
    if(withSprite){
        var Box =  require('../client/Components/Box/Box');
        boxBody = new Box(id,size.width,size.height,pos,0,Materials.ground(),id,this.world,b2_staticBody);
    }else{
        boxBody = new BoxBody(size.width,size.height,b2_staticBody,1,1,1,pos,0,id,this.world);
    }
    return boxBody;
};
World.prototype.debugDraw = function(camera){
    var debugDraw,canvas,ctx;
    this.clearDraw();
    debugDraw = new b2DebugDraw()
    canvas = document.getElementById("box2d");
    if(!canvas) return;

    ctx = canvas.getContext("2d");

    if(camera){
        ctx.translate(camera.position.x,camera.position.y);
    }
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(PMR);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    this.world.SetDebugDraw(debugDraw);
};
World.prototype.clearDraw = function(){
    //if(this.world && this.world.m_debugDraw){
    //    this.world.m_debugDraw.m_ctx.clearRect(0,0,800,800);
    //}
}
World.prototype.getBodies = function(){
    var world = this.world;
    var body = world.GetBodyList(),
        bodies = [];

    do {
        var userData = body.GetUserData();

        if(userData && userData.id && body.IsAwake() && userData.type!=='ground'){
            bodies.push(userData.toObject());
        }
    } while (body = body.GetNext());
    return bodies;
};

World.prototype.getJoints = function(){
    var world = World.world;
    var joints = [];

    _.each(this.entityManager.joints,function(joint,id){
        if(joint.joint){
            joints.push(joint.toObject());
        }
    });
    return joints;

};
World.prototype.pushState = function(){
    if(typeof EditorState !== "undefined"){
        EditorState.pushState(this.getCurrentState());
    }
};
World.prototype.getCurrentState = function(){
    return {bodies:this.getBodies(),joints:this.getJoints()}
};
World.prototype.startListenningContacts = function(){
    new ContactListener(this.world,this.entityManager);
}   
World.prototype.findBody = function(id){
    return World.findWorldBody(this.world,id);
}       
World.findWorldBody = function(world,id){
    var body = world.GetBodyList();
    do {
        var userData = body.GetUserData();

        if(userData && userData.id && userData.id == id){
            return body;
        }
    } while (body = body.GetNext());
};
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    global.World = World;
    module.exports = World;
}
