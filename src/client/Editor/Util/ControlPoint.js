var ControlPoint = cc.DrawNode.extend({
    config:null,
    isActive:false,
    startPoint:null,
    controlledObject:null,
    ctor:function(config){
        this._super();
        this.config = config;
        this._contentSize = new cc.Size(5,5)
        this.draw();
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
        if(cc.rectContainsPoint(this.getBoundingBoxToWorld(),cc.p(event._x,event._y))){
            this._setActive(event)
            event.stopPropagation();
        }
    },
    onMouseUp:function(event){
        this.isActive = false;
    },
    onMouseMove:function(event){

    },
    calcObjectCenter:function(){
        var box = this.controlledObject.getBoundingBoxToWorld()
        return cc.p(box.x + box.width/2 , box.y+box.height/2)
    },
    _setActive:function(event){
        this.isActive = true;
        this.controlledObject = this.parent.parent;
        this.startPoint = cc.p(event._x,event._y);
        this.center = this.calcObjectCenter();
    }
})