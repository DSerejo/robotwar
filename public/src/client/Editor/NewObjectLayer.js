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
        this.startedPoint = cc.pointFromEvent(event);
        if(this.type=='pin'){
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
            if(this.type=='pin')
                return this.callBack()
        }else{
            this.objectToBeAdded && this.objectToBeAdded.setOptions(this.prepareObjectOptionsFromEvent(event))
            this.objectToBeAdded && this.objectToBeAdded.recreateSprite()
        }



    },
    removeObject:function(){
        if(this.objectToBeAdded){
            this.objectToBeAdded.sprite.removeFromParent();
            delete this.objectToBeAdded;
        }
    },
    createObject:function(event){
        var options = this.prepareObjectOptionsFromEvent(event);
        this.objectToBeAdded = new Factory[this.type](this.world,options)
        this.addChild(this.objectToBeAdded.sprite)
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
        var currentPos = cc.pointFromEvent(event);
        return cc.p(
            Math.min(this.startedPoint.x,currentPos.x),
            Math.min(this.startedPoint.y,currentPos.y)
        )
    },
    prepareSize:function(event){
        return cc.pToSize(cc.pCompOp(cc.pSub(this.startedPoint,cc.pointFromEvent(event)),Math.abs))
    },
    objectToJson:function(){
        var pos = cc.pAdd(this.objectToBeAdded.sprite.getPosition(),
            cc.pMult(cc.pFromSize(this.objectToBeAdded.sprite.getContentSize()),1/2)
        )
        return _.extend({},this.objectToBeAdded.sprite.getContentSize(),{
            position:pos,
            type:2,
            'class':this.type,
            radius:this.objectToBeAdded.sprite.getContentSize().width/2,
            angle:0
        })
    }

})