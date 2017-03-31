var cc = require('../../constants').cc;
var EditorState = require('./EditorState');
var WorldLayer = require('./WorldLayer');
var NewObjectLayer = require('./NewObjectLayer');
var EventClass = require('event-class');
var _ = require('lodash');
var toastr = require('toastr');

class EditorScene extends cc.Scene{
    constructor(){
        super();
        this.objects = [];
        this.selectedObject = null;
        this.mousePressed =  false;
        this.selectedNode = null;
        this.newObjectLayer = null;
        this.event = new EventClass();
    }
    onEnter () {
        super.onEnter();
        var background = new cc.LayerColor(cc.color(255,255,255));
        this.listenEvents();
        this.addChild(background,-1,EditorScene.Tags.background);
        EditorState.loadFromDB();
        this.worldLayer = new WorldLayer(this.robot);
        this.addChild(this.worldLayer);
        //this.worldLayer.setAnchorPoint(0.5,0.5);
        window.editor = this
        this.event.trigger('start');
    }
    restartWith(robot){
        EditorState.restart();
        this.setAllObjectsToInactive();
        this.worldLayer.currentState = robot;
        this.worldLayer.restart();
    }
    togglePhysics(){
        this.worldLayer.stopped = !this.worldLayer.stopped;
    }
    listenEvents(){
        var self = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this),
            onMouseScroll: this.onMouseScroll.bind(this)
        });
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed(key,event){
                self.editorHtmlLayer && self.editorHtmlLayer.keyPressed(key,event);
                if(key==17)
                    self.ctrlPressed = true;
                _.each(self.worldLayer.objects,function(o){
                    o.onKeyPressed && o.onKeyPressed(key,event)
                })
                if(key==27){
                    self.newObjectLayer && self.removeNewObjectLayer();
                }
            },
            onKeyReleased(key,event){
                self.editorHtmlLayer && self.editorHtmlLayer.keyReleased(key,event);
                if(key==17)
                    self.ctrlPressed = false;
                _.each(self.worldLayer.objects,function(o){
                    o.onKeyReleased && o.onKeyReleased(key,event)
                })
            }
        },this)
    }
    onMouseDown(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = true;
        var objects = this.getElementAtMouse(event);
        if(objects.length){
            this.updateSelectedObject(objects);
            if(this.shouldTransform()){
                //TODO: move
            }
        }else
            this.setAllObjectsToInactive()
    }
    onMouseScroll(event){
        var dScale = event._scrollY/1200;
        this.worldLayer.scaleWorld(WORLD_SCALE + dScale);
    }
    shouldTransform(){
        
    }
    isNewObjectLayerClicked(){
        return this.newObjectLayer
    }
    
    
    onMouseUp(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = false;
        if(this.transforming){
            this.worldLayer.worldManager.pushState();
        }
        this.transforming = false;

    }
    onMouseMove(event){
        if(this.isNewObjectLayerClicked()) return;
        //TODO move
    }
    getElementAtMouse(event){
        var self = this;
        return _.filter(self.worldLayer.objects,function(o){
            return o.sprite && o.isTouched &&  o.isTouched(cc.pointFromEvent(event)) && o.getName!=EditorScene.Tags.background
        })
    }
    rectContainsPoint(object,event){
        return cc.rectContainsPoint(object.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    }
    
    setSelectedObject(id){
        var object = this.worldLayer.entityManager.getWithId(id);
        if(!object) return;
        this.selectedObject && this.selectedObject.unSelect();
        this.selectedObject = object;
        this.selectedObject.select();
        this.event.trigger('change:selectedObject');
        //this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);
    }
    selectedPrevObject(){
        const objects = this.worldLayer.objects;
        if(!objects.length) return;
        if(!this.selectedObject){
             this.setSelectedObject(this.getObjectIdWithIndex(objects.length-1));
        }
        const self = this;
        var index = _.findIndex(objects,function(o){return o== self.selectedObject});
        if( index == 0){
            this.setSelectedObject(this.getObjectIdWithIndex(objects.length-1));
        }else{
            this.setSelectedObject(this.getObjectIdWithIndex(index-1));
        }
    }
    selectedNextObject(){
        const objects = this.worldLayer.objects;
        if(!objects.length) return;
        if(!this.selectedObject){
             this.setSelectedObject(this.getObjectIdWithIndex(0));
        }
        const self = this;
        var index = _.findIndex(objects,function(o){return o== self.selectedObject});
        if( index == objects.length-1){
            this.setSelectedObject(this.getObjectIdWithIndex(0));
        }else{
            this.setSelectedObject(this.getObjectIdWithIndex(index+1));
        }
    }
    getObjectIdWithIndex(index){
        return this.worldLayer.objects[index].id
    }
    updateSelectedObject(objects){
        this.selectedObject && this.selectedObject.unSelect();
        this.selectedObject = this.findSelectedObject(objects);
        this.selectedObject.select();
        this.event.trigger('change:selectedObject');
        //this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);

    }

    findSelectedObject(objects){
        if(!this.selectedObject){
            return objects[objects.length-1];
        }
        var self = this;
        var index = _.findIndex(objects,function(o){return o==self.selectedObject});
        if(index == -1 ) return objects[0];
        if( index == objects.length-1)
            return this.ctrlPressed?objects[0]:objects[index];
        return this.ctrlPressed?objects[index+1]:objects[index];
    }
    setAllObjectsToInactive(){
        this.selectedObject && this.selectedObject.unSelect();
        this.selectedObject = null;
        this.event.trigger('change:selectedObject');
        //this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);

    }
    removeSelectedObject(){
        if(this.selectedObject){
            if(this.selectedObject.type=='pin'){
                this.worldLayer.entityManager.removeJoint(this.selectedObject);
            }else{
                this.worldLayer.entityManager.removeEntity(this.selectedObject);
            }
            this.worldLayer.objects.splice(this.worldLayer.objects.indexOf(this.selectedObject),1);
            this.setAllObjectsToInactive();
        }
    }
    getSelectedObject(){
        if(this.newObjectLayer && this.newObjectLayer.objectToBeAdded){
            return this.newObjectLayer.objectToBeAdded;
        }
        return this.selectedObject;
    }
    addNewObject(type,options){
        this.removeNewObjectLayer();
        this.newObjectLayer = new NewObjectLayer(this.world,options,this.worldLayer.factory);
        this.addChild(this.newObjectLayer);
        var self = this;
        this.newObjectLayer.startCreating(type,function(){
            if(!self.newObjectLayer) return;
            self.worldLayer.addObject(self.newObjectLayer.objectToJson());
            if(type=='pin'){
                self.worldLayer.entityManager.joints[self.worldLayer.entityManager.lastID].updateBodyFromSprite();
            }
            self.newObjectLayer.objectToBeAdded.remove();
            self.newObjectLayer.removeFromParent();
            self.newObjectLayer = null
            toastr.success("Done!",null,{timeOut:2000,positionClass:'toast-top-center'});
        })
    }
    removeNewObjectLayer(){
        if(!this.newObjectLayer) return;
        this.newObjectLayer.objectToBeAdded && this.newObjectLayer.objectToBeAdded.remove();
        this.newObjectLayer.removeFromParent();
        this.newObjectLayer = null
    }
    logLife(){
        _.each(this.worldLayer.objects,function(o){
            o.body && console.log(o.options.id, o.life)
        })
    }
    getEntityManager(){
        return this.worldLayer?this.worldLayer.worldManager.entityManager:null 
    }

}

EditorScene.Tags = {
    background:"BACKGROUND"
};

module.exports = EditorScene;