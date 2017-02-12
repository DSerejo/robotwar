var NewObjectLayer = cc.Layer.extend({
    callBack:null,
    type:null,
    _mousePressed:false,
    objectToBeAdded:null,
    startedPoint:null,
    world:null,
    options:{},
    ctor:function(world,options){
        this._super()
        this.world = world
        this.options = options
        this.listenEvents()
    },
    listenEvents: function(){
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
    },
    onMouseDown:function(event){
        this._mousePressed = true;
        this.startedPoint = cc.convertPointToMeters(cc.pointFromEvent(event));
        if(this.isFixedSize()){
            this.updateObject(event);
        }
    },
    onMouseMove:function(event){
        if(this._mousePressed)
            this.updateObject(event);
    },
    onMouseUp:function(event){
        this._mousePressed = false;
        this.callBack && this.callBack()
    },
    startCreating:function(type,callBack){
        this.callBack = callBack;
        this.type = type;
    },
    updateObject:function(event){
        if(!this.objectToBeAdded){
            this.createObject(event);
            if(this.isFixedSize())
                return this.callBack()
        }else{
            this.objectToBeAdded && this.updateSpriteOptions(event)
            this.objectToBeAdded && this.objectToBeAdded.recreateSprite()
        }



    },
    isFixedSize:function(){
        return  this.type=='pin' || this.type=='propulsor';
    },
    removeObject:function(){
        if(this.objectToBeAdded){
            this.objectToBeAdded.sprite.removeFromParent();
            delete this.objectToBeAdded;
        }
    },
    createObject:function(event){
        var options = this.prepareObjectOptionsFromEvent(event);
        this.objectToBeAdded = new Factory[this.type](options);
        this.addChild(this.objectToBeAdded.sprite)
    },
    updateSpriteOptions:function(event){
        this.objectToBeAdded.pos = this.preparePosition(event);
        var size = this.prepareSize(event);
        this.objectToBeAdded.h = size.height;
        this.objectToBeAdded.w = size.width;
    },
    prepareObjectOptionsFromEvent:function(event){
        return _.extend({},
            this.options,
            this.prepareSize(event),
            {
                position:this.preparePosition(event),
                type:b2_dynamicBody,
                delayedBodyCreation:true,
                delayedPosition:true,
                angle:0
            })
    },
    preparePosition:function(event){
        var currentPos = cc.convertPointToMeters(cc.pointFromEvent(event));
        return cc.p(
            Math.min(this.startedPoint.x,currentPos.x),
            Math.min(this.startedPoint.y,currentPos.y)
        )
    },
    prepareSize:function(event){
        return cc.pToSize(cc.pCompOp(cc.pSub(this.startedPoint,cc.convertPointToMeters(cc.pointFromEvent(event))),Math.abs))
    },
    objectToJson:function(){
        return _.extend({},this.objectToBeAdded.toObject(),{
            width: this.objectToBeAdded.w,
            height: this.objectToBeAdded.h
        })
    }

})