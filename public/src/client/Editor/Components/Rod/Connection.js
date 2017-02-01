var RodConnection = cc.Node.extend({
    radius:5,
    circleColor:'#6D6D6D',
    ctor: function(){
        this._super();
        this.draw();
        this.listenEvents()
    },
    init:function(){
        this.setAnchorPoint(cc.p(0.5,0.5))
    },
    draw:function(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.setPosition(this.radius,this.radius)
        dn.drawDot(cc.p(0,0), this.radius,cc.color(this.circleColor));
        this._contentSize = cc.size(this.radius*2,this.radius*2)
    },listenEvents: function(){
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
            this.isActive = true;
            event.stopPropagation();
        }
    },
    onMouseUp:function(event){
        if(this.isActive)
            this.parent.recreate()
        this.isActive = false;

    },
    onMouseMove:function(event){
        if(this.isActive){
            this.setPosition(this.parent.convertToNodeSpaceAR(cc.p(event._x,event._y)));
            this.parent.drawBar()

        }
    },
})