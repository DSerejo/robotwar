
var EditorScene = cc.Scene.extend({
    objects:[],
    stopped:false,
    selectedObject:null,
    mousePressed: false,
    selectedNode:null,
    newObjectLayer:null,
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));
        this.listenEvents();
        this.addChild(background,-1,EditorScene.Tags.background);
        this.worldLayer = new WorldLayer(TestScenes.running);
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
                _.each(self.worldLayer.objects,function(o){
                    o.onKeyPressed && o.onKeyPressed(key,event)
                })
            },
            onKeyReleased:function(key,event){
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
            this.showControlLayer()
            this.updateSelectedObject(objects)
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

    },
    onMouseMove:function(event){
        if(this.isNewObjectLayerClicked()) return;
        if(this.shouldTransform()){
            this.controlLayer.selectedButton.transform(event,this.selectedObject);
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
    updateSelectedObject:function(objects){
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = this.findSelectedObject(objects);
        this.selectedObject.select()

    },
    findSelectedObject:function(objects){
        if(!this.selectedObject){
            return objects[0];
        }
        var self = this
        var index = _.findIndex(objects,function(o){return o==self.selectedObject})
        if(index == -1 || index == objects.length-1) return objects[0];
        return objects[index+1];
    },
    setAllObjectsToInactive:function(){
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = null

    },
    addNewObject:function(type,options){
        this.newObjectLayer = new NewObjectLayer(this.world,options);
        this.addChild(this.newObjectLayer)
        var self = this;
        this.newObjectLayer.startCreating(type,function(){
            self.worldLayer.initObjects([self.newObjectLayer.objectToJson()]);
            self.newObjectLayer.objectToBeAdded.removeFromParent()
            self.newObjectLayer.removeFromParent()
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
