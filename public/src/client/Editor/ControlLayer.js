var ControlLayer = cc.Node.extend({
    widthFactor:1/3,
    height_:40,
    selectedButton:null,
    ctor:function(){
        this._super()
        this.drawBackGround();
        this.moveToTopRightPosition()
        this.addButtons()
        this.listenEvents()
    },
    drawBackGround: function(){
        var size = cc.view.getDesignResolutionSize(),
            dn  = new cc.DrawNode()
        dn.drawRect(cc.p(0,0), cc.p(size.width*this.widthFactor,this.height_), cc.color("#FFFFFF"), 1, cc.color("#6D6D6D"));
        this.setContentSize(size.width*this.widthFactor,this.height_);
        this.addChild(dn);
    },
    moveToTopRightPosition:function(){
        var size = cc.view.getDesignResolutionSize()
        this.setPosition(size.width - size.width*this.widthFactor, size.height - this.height_);
    },
    addButtons:function(){
        var self = this;
        _.each(ControlLayer.controllers,function(button){
            var o = button.create();
            self.addChild(o);
            self.positionButton(o,button.position(self.getContentSize(), o.getContentSize()))
            if(button.type=='move'){
                self.moveButton = o;
            }
        })
    },
    positionButton:function(object,positionDef){
        object.setPosition(positionDef.x,positionDef.y)
    },
    listenEvents: function(){
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown.bind(this),
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
    },
    onMouseDown:function(event){
        if(this.isOutsideLayer(event) && this.parent.selectedObject)
            return;
        var element = this.getElementAtMouse(event);
        this.updateSelectedButton(element)
    },
    isOutsideLayer:function(event){
        return !cc.rectContainsPoint(this.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    },
    getElementAtMouse:function(event){
        return _.find(this.getChildren(),function(o){
            return cc.rectContainsPoint(o.getBoundingBoxToWorld(),cc.p(event._x,event._y))
        })
    },

    updateSelectedButton:function(button){
        if(this.selectedButton){
            if(this.selectedButton==button){
                this.selectedButton.onInactive && this.selectedButton.onInactive()
                return this.selectedButton = null
            }else{
                this.selectedButton.onInactive && this.selectedButton.onInactive()
            }
        }
        this.selectedButton = button
        button && this.selectedButton.onActive && this.selectedButton.onActive()
    }

})

ControlLayer.controllers = [
    {
        'create':function(){return new ScaleButton()},
        'position':function(parentSize,objectSize){return {x:10,y:parentSize.height/2-objectSize.height/2}}
    },{
        'create':function(){return new ScaleXButton()},
        'position':function(parentSize,objectSize){return {x:40,y:parentSize.height/2-objectSize.height/2}}
    },{
        'create':function(){return new ScaleYButton()},
        'position':function(parentSize,objectSize){return {x:70,y:parentSize.height/2-objectSize.height/2}}
    },{
        'create':function(){return new MoveButton()},
        'position':function(parentSize,objectSize){return {x:100,y:parentSize.height/2-objectSize.height/2}},
        'type':'move'
    },{
        'create':function(){return new RotateButton()},
        'position':function(parentSize,objectSize){return {x:130,y:parentSize.height/2-objectSize.height/2}}
    }
]