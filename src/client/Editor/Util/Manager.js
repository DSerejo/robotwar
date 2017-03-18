var Manager = cc.Node.extend({
    _objects:[],
    _activeObject:null,
    _isMoving:false,
    _maxZ:0,
    ctor:function(){
        this._super()
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
        cc.eventManager.setPriority(listener,0);
    },
    addChild:function (o){

        this._super(o)
        this._maxZ = Math.max(o.zIndex,this._maxZ);
    },
    onMouseDown:function(event){
        var _this = this;
        var found;
        this.children.forEach(function(node){
            if(cc.rectContainsPoint(node.getBoundingBox(),new cc.Point(event._x,event._y))){
                node.setActive(event);
                _this._activeObject = node;
                found = true;
            }
        })
        this._isMoving = true;
        if(!found && this._activeObject){
            this._activeObject.unSetActive();
            this._activeObject = null;

        }

    },
    onMouseUp:function(event){
        this._isMoving = false;
    },
    onMouseMove:function(event){
        if(this._isMoving && this._activeObject){
            var newX = event._x - this._activeObject.mouseX;
            var newY = event._y - this._activeObject.mouseY;
            this._activeObject.setPosition(new cc.Point(newX,newY));
        }
    }
})

