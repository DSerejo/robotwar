
var EntityManager = function(){
}
EntityManager.lastID = 0;
EntityManager.entities = {};
EntityManager.joints = {};
EntityManager.graveyard = [];
EntityManager.addNewEntity = function(entity){
    if(!entity instanceof  Entity)
        throw 'entity must be instance of Entity';
    if(EntityManager.hasEntityId(entity.id)) return;
    EntityManager.entities[entity.id] = entity;
};
EntityManager.addNewJoint = function(joint){
    if(EntityManager.hasJointId(joint.id)) return;
    EntityManager.joints[joint.id] = joint;
};
EntityManager.hasEntityId = function(id){
    return EntityManager.entities.hasOwnProperty(id);
};
EntityManager.hasJointId = function(id){
    return EntityManager.joints.hasOwnProperty(id);
};
EntityManager.getEntityWithId = function(id){
    if(EntityManager.hasEntityId(id))
    return EntityManager.entities[id];
};
EntityManager.newID = function(){
    return ++EntityManager.lastID;
};
EntityManager.removeDeadBodies = function(){
    _.each(EntityManager.graveyard,function(e,id,g){
        e.remove();
        delete g[id];
    })
};
EntityManager.updateAll = function(){
    _.each(EntityManager.entities,function(e){
        e.update()
    })
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = EntityManager;
}