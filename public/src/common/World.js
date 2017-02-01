
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var BoxBody =  require('./Physics/BoxBody');
    var EntityManager =  require('./Physics/EntityManager');
}
var World = function(entityFactory){
    this.entityFactory = entityFactory;
    World.world = new b2World(gravity);
    World.world.SetContinuousPhysics(true);
    this.staticObjects = [];
};
World.prototype.setupWorld = function(initialObjects){
    this.createGround();
    initialObjects && this.setInitialObjects(initialObjects);
};
World.prototype.clearAllDynamic = function(){
    _.each(EntityManager.entities,function(o){
        o.remove();
    });
    _.each(EntityManager.joints,function(o){
        o.removeJoint();
    });
    EntityManager.entities = {};
    EntityManager.joints = {}

};
World.prototype.setInitialObjects = function(initialObjects,callback){
    var self = this;
    _.each(initialObjects.bodies,function(o){
        if(o.id && EntityManager.hasEntityId(o.id)) return;
        var entity = self.entityFactory[o.class](o);
        if(o.lv){
            entity.body.SetLinearVelocity(o.lv)
            entity.body.SetAngularVelocity(o.av)
        }
        callback && callback(entity);
        EntityManager.addNewEntity(entity);
    });
    _.each(initialObjects.joints,function(o){
        if(o.id && EntityManager.hasEntityId(o.id)) return;
        var entity = self.entityFactory[o.class](o);
        callback && callback(entity);
        EntityManager.addNewJoint(entity);
    });
};
World.prototype.createGround=function(){
    var pos = cc.p(0,0),
        size = cc.size(50,1);
    this.staticObjects.push(this.createStaticBoxBody(pos,size,'ground'));
};
World.prototype.createStaticBoxBody = function(pos,size,id){
    var boxBody = new BoxBody(size.width,size.height,b2_staticBody,1,1,1,pos,0,id);
    return boxBody.body;
};
World.prototype.debugDraw = function(){
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
    debugDraw.SetDrawScale(PMR);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    World.world.SetDebugDraw(debugDraw);
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    global.World = World;
    module.exports = World;
}
