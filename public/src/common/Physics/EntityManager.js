if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var _ = require('lodash');
}

var EntityManager = function(){
};
EntityManager.lastID = 0;
EntityManager.entities = {};
EntityManager.joints = {};
EntityManager.graveyard = [];
EntityManager.actionKeys = {};

EntityManager.addNewEntity = function(entity){
    if(!entity instanceof  Entity)
        throw 'entity must be instance of Entity';
    if(EntityManager.hasEntityId(entity.id)) return;
    EntityManager.entities[entity.id] = entity;
    EntityManager.addActionKeys(entity);
};

EntityManager.addActionKeys= function(entity){
    _.each(entity.actionKeys,function(keyCode){
        EntityManager.actionKeys[keyCode] = EntityManager.actionKeys[keyCode] || [];
        EntityManager.actionKeys[keyCode].push(entity);
    })
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
EntityManager.getWithId = function(id){
    if(EntityManager.hasEntityId(id))
        return EntityManager.entities[id];
    else if(EntityManager.hasJointId(id))
        return EntityManager.joints[id];
    return null;
};
EntityManager.newID = function(){
    return ++EntityManager.lastID;
};
EntityManager.removeEntity = function(entity){
    entity.remove();
    delete EntityManager.entities[entity.id];
};
EntityManager.removeJoint = function(joint){
    joint.remove();
    delete EntityManager.joints[joint.id];
};
EntityManager.removeJoint = function(entity){

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
    });
    _.each(EntityManager.joints,function(e){
        e.update && e.update()
    })
};
EntityManager.performAllActions = function(callBack){
    var updateIsNeeded = false;
    _.each(EntityManager.entities,function(e){
        e.performAction && e.performAction(function(update){
            if(update)
                updateIsNeeded = true;
        });
    });
    callBack && callBack(updateIsNeeded);
};
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = EntityManager;
}