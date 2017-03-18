if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var _ = require('lodash');
    var Entity = require('./Entity');
}

var EntityManager = function(){
};
EntityManager.prototype.lastID = 0;
EntityManager.prototype.entities = {};
EntityManager.prototype.joints = {};
EntityManager.prototype.graveyard = {};
EntityManager.prototype.actionKeys = {};

EntityManager.prototype.addNewEntity  = function(entity){
    if(!entity instanceof  Entity)
        throw 'entity must be instance of Entity';
    if(this.hasEntityId(entity.id)) return;
    this.entities[entity.id] = entity;
    this.addActionKeys(entity);
};

EntityManager.prototype.addActionKeys = function(entity){
    var self = this;
    _.each(entity.actionKeys,function(keyCode){
        self.actionKeys[keyCode] = self.actionKeys[keyCode] || [];
        self.actionKeys[keyCode].push(entity);
    })
};
EntityManager.prototype.addNewJoint  = function(joint){
    if(this.hasJointId(joint.id)) return;
    this.joints[joint.id] = joint;
};
EntityManager.prototype.getEntitiesToBeTriggered = function(keyCode,clientId){
    return _.filter(this.actionKeys[keyCode],function(e){
        return e.id.indexOf(clientId)>=0;
    })
};
EntityManager.prototype.hasEntityId  = function(id){
    return this.entities.hasOwnProperty(id);
};
EntityManager.prototype.hasJointId  = function(id){
    return this.joints.hasOwnProperty(id);
};
EntityManager.prototype.getEntityWithId  = function(id){
    if(this.hasEntityId(id))
    return this.entities[id];
};
EntityManager.prototype.getWithId  = function(id){
    if(this.hasEntityId(id))
        return this.entities[id];
    else if(this.hasJointId(id))
        return this.joints[id];
    return null;
};
EntityManager.prototype.newID  = function(){
    var newId = ++this.lastID;
    while(this.hasEntityId(newId) || this.hasJointId(newId)){
        newId = ++this.lastID;
    }
    return newId;
};
EntityManager.prototype.removeEntity  = function(entity){
    entity.remove();
    delete this.entities[entity.id];
};
EntityManager.prototype.removeJoint  = function(joint){
    joint.remove();
    delete this.joints[joint.id];
};
EntityManager.prototype.updateDeadBodies  = function(callBack){
    var self = this;
    var updateIsNeeded = false;
    _.each(this.entities,function(e,id){
        if(e.life<=0){
            updateIsNeeded = true;
            self.graveyard[id]=e;
        }
    })
    updateIsNeeded && callBack();
}   
EntityManager.prototype.removeDeadBodies  = function(){
    var self = this;
    _.each(this.graveyard,function(e,id,g){
        self.removeEntity(e);
        delete g[id];
    })
};
EntityManager.prototype.updateAll  = function(){
    _.each(this.entities,function(e){
        e.update && e.update()
    });
    _.each(this.joints,function(e){
        e.update && e.update()
    })
};
EntityManager.prototype.performAllActions  = function(callBack){
    var updateIsNeeded = false;
    _.each(this.entities,function(e){
        e.performAction && e.performAction(function(update){
            if(update)
                updateIsNeeded = true;
        });
    });
    callBack && callBack(updateIsNeeded);
};
EntityManager.prototype.getPlayerHeart = function(playerId){
    return _.find(this.entities,function(e){return e.id.indexOf(playerId)>=0})
};
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = EntityManager;
}