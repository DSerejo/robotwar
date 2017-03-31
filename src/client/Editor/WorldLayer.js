var Camera = require('../Camera');
var EntityManager = require('../../common/Physics/EntityManager');
var ContactListener = require('../../common/Physics/ContactListener');
var Entity = require('../../common/Physics/Entity');
var World = require('../../common/World');
var Factory = require('../Components/Factory');
var cc = require('../../constants').cc;
class WorldLayer extends cc.Layer{
    constructor(initialObjects){
        super();
        this.setDefaults();
        this.objectsLayer = new cc.Layer();
        this.addChild(this.objectsLayer);
        this.setAnchorPoint(0,0);
        this.camera = new Camera();
        this.camera.notify = this.cameraChanged.bind(this);
        this.initWorld(initialObjects);
        window.worldLayer = this;
        setInterval(this.update.bind(this),1000/60);
    }
    setDefaults(){
        this.objects = [];
        this.staticObjects = [];
        this.stopped = true;
        this.currentState = {};
        this.jointObjects = ['pin']
    }
    initWorld(initialObjects){
        this.entityManager = new EntityManager();
        this.factory = new Factory(this.entityManager);
        this.worldManager = new World(this.factory);
        this.factory.setWorld(this.worldManager.world);
        this.updateWorld();
        this.world = this.worldManager.world;
        this.addObjects(initialObjects);
    }
    update(){
        this.worldManager.DrawDebugData();
        if(this.stopped) return;
        this.worldManager.world.Step(1/60,10,10);
        this.worldManager.world.ClearForces();
        this.entityManager.updateDeadBodies();
        this.entityManager.removeDeadBodies();
        this.entityManager.updateAll();
        this.camera.moveToFitSprite(this.getHeartElement().sprite)
    }

    updateWorld(){
        this.worldManager.clearAllStatic();
        this.worldManager.debugDraw(this.camera);
        this.worldManager.setupWorld(null,true);
        var self = this;
        this.worldManager.staticObjects.forEach(function(o){
            o.sprite && self.addChild(o.sprite);
        })
    }
    addObjects(objects){
        var self = this;
        this.worldManager.setInitialObjects(objects,function(object){
            self.objects.push(object);
            if(object.sprite)
                self.objectsLayer.addChild(object.sprite,object.type==Entity.types.pin?2:0);
        });
    }
    addObject(object){
        var entity =this.worldManager.createEntityFromOptions(object);
        if(this.jointObjects.indexOf(object.class)>=0){
            this.entityManager.addNewJoint(entity);
        }else{
            this.entityManager.addNewEntity(entity);
        }
        this.objects.push(entity);
        if(entity.sprite)
            this.objectsLayer.addChild(entity.sprite,entity.type==Entity.types.pin?2:0);
    }
    scaleWorld(scale){
        WORLD_SCALE = scale;
        UPDATE_PMR();
        this.updateWorld([]);
        this.setScale(scale)
    }
    cameraChanged(){
        this.setPosition(this.camera.position);
        this.updateWorld([]);
    }
    run(){
        this.saveCurrentState();
        this.stopped = false;
    }
    saveCurrentState(){
        this.currentState = JSON.parse(JSON.stringify(this.worldManager.getCurrentState()));
    }
    save(){
        this.saveCurrentState();
        window.localStorage['robot_' + window.robotName] = JSON.stringify(this.currentState);
    }
    restart(){
        this.stopped = true;
        this.currentSelectedId = this.parent.selectedObject?this.parent.selectedObject.id:null;
        this.worldManager.clearAllDynamic();
        this.objects = [];
        this.parent.setAllObjectsToInactive();
        this.addObjects(this.currentState);
        this.setPosition(0,0);
        if(this.currentSelectedId){
            this.parent.setSelectedObject(this.currentSelectedId)
        }
    }
    undo(){
        this.currentState = EditorState.prevState();
        this.restart();
    }
    redo(){
        this.currentState = EditorState.nextState();
        this.restart();
    }
    getHeartElement(){
        return this.entityManager.entities[Object.keys(this.entityManager.entities)[0]]
    }
}



module.exports = WorldLayer;