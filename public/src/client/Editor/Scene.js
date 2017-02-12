
var EditorScene = cc.Scene.extend({
    objects:[],
    selectedObject:null,
    mousePressed: false,
    selectedNode:null,
    newObjectLayer:null,
    editorHtmlLayer:null,
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));
        this.listenEvents();
        this.addChild(background,-1,EditorScene.Tags.background);
        EditorState.loadFromDB();
        this.worldLayer = new WorldLayer(EditorState.currentState());
        this.addChild(this.worldLayer);
        window.editor = this
    },
    togglePhysics:function(){
        this.worldLayer.stopped = !this.worldLayer.stopped;
    },
    listenEvents: function(){
        var self = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key,event){
                self.editorHtmlLayer && self.editorHtmlLayer.keyPressed(key,event);
                if(key==17)
                    self.ctrlPressed = true;
                _.each(self.worldLayer.objects,function(o){
                    o.onKeyPressed && o.onKeyPressed(key,event)
                })
            },
            onKeyReleased:function(key,event){
                self.editorHtmlLayer && self.editorHtmlLayer.keyReleased(key,event);
                if(key==17)
                    self.ctrlPressed = false;
                _.each(self.worldLayer.objects,function(o){
                    o.onKeyReleased && o.onKeyReleased(key,event)
                })
            }
        },this)
    },
    onMouseDown:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = true;
        var objects = this.getElementAtMouse(event);
        if(objects.length){
            if(this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton.getName()!='Move' && this.selectedObject && this.selectedObject.isTouched(cc.pointFromEvent(event))) return;
            this.showControlLayer();
            this.updateSelectedObject(objects);
            if(this.shouldTransform()){
                this.controlLayer.selectedButton.startTransformation&&this.controlLayer.selectedButton.startTransformation(event,this.selectedObject);
            }
        }else{
            if(!this.isControlLayerClicked(event) && !this.isRotateAction()){
                this.hideControlLayer()
                this.setAllObjectsToInactive()

            }
        }
    },
    shouldTransform:function(){
        return this.mousePressed && this.controlLayer && this.controlLayer.selectedButton && !this.isControlLayerClicked(event)
    },
    isNewObjectLayerClicked:function(){
        return this.newObjectLayer
    },
    isControlLayerClicked:function(event){
        return this.controlLayer && this.rectContainsPoint(this.controlLayer,event)
    },
    isRotateAction:function(){
        return this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton._name=="Rotate"
    },
    onMouseUp:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = false;
        if(this.transforming){
            World.pushState();
        }
        this.transforming = false;

    },
    onMouseMove:function(event){
        if(this.isNewObjectLayerClicked()) return;
        if(this.shouldTransform()){
            this.controlLayer.selectedButton.transform(event,this.selectedObject);
            this.editorHtmlLayer.setSelectedObject(this.selectedObject);
            this.transforming = true;
        }
    },
    getElementAtMouse:function(event){
        var self = this;
        return _.filter(self.worldLayer.objects,function(o){
            return o.sprite && o.isTouched &&  o.isTouched(cc.pointFromEvent(event)) && o.getName!=EditorScene.Tags.background
        })
    },
    rectContainsPoint:function(object,event){
        return cc.rectContainsPoint(object.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    },
    showControlLayer:function(){
        if(!this.controlLayer){
            this.controlLayer = new ControlLayer();
            this.addChild(this.controlLayer);
        }
        if(!this.controlLayer.selectedButton){
            this.controlLayer.selectedButton = this.controlLayer.moveButton
            this.controlLayer.moveButton.onActive()
        }

    },
    hideControlLayer:function(){
        if(this.controlLayer){
            this.controlLayer.removeFromParent()
            this.controlLayer = null
        }
    },
    setSelectedObject:function(id){
        var object = EntityManager.getWithId(id);
        if(!object) return;
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = object;
        this.selectedObject.select()
        this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);
    },
    updateSelectedObject:function(objects){
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = this.findSelectedObject(objects);
        this.selectedObject.select()
        this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);

    },

    findSelectedObject:function(objects){
        if(!this.selectedObject){
            return objects[objects.length-1];
        }
        var self = this
        var index = _.findIndex(objects,function(o){return o==self.selectedObject})
        if(index == -1 ) return objects[0];
        if( index == objects.length-1)
            return this.ctrlPressed?objects[0]:objects[index];
        return this.ctrlPressed?objects[index+1]:objects[index];
    },
    setAllObjectsToInactive:function(){
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = null
        this.editorHtmlLayer && this.editorHtmlLayer.setSelectedObject(this.selectedObject);

    },
    removeSelectedObject:function(){
        if(this.selectedObject){
            if(this.selectedObject.type=='pin'){
                EntityManager.removeJoint(this.selectedObject);
            }else{
                EntityManager.removeEntity(this.selectedObject);
            }
        }
    },
    addNewObject:function(type,options){
        this.newObjectLayer = new NewObjectLayer(this.world,options);
        this.addChild(this.newObjectLayer);
        var self = this;
        this.newObjectLayer.startCreating(type,function(){
            if(!self.newObjectLayer) return;
            self.worldLayer.addObject(self.newObjectLayer.objectToJson());
            if(type=='pin'){
                EntityManager.joints[EntityManager.lastID].updateBodyFromSprite();
            }
            self.newObjectLayer.objectToBeAdded.remove();
            self.newObjectLayer.removeFromParent();
            self.newObjectLayer = null
        })

    },
    logLife:function(){
        _.each(this.worldLayer.objects,function(o){
            o.body && console.log(o.options.id, o.life)
        })
    }

});

EditorScene.Tags = {
    background:"BACKGROUND"
}
