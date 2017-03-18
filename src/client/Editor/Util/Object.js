
var ObjectBase = cc.Node.extend({
    controlPoints:{
        tl:true,
        tm:true,
        tr:true,
        ml:true,
        mr:true,
        bl:true,
        bm:true,
        br:true,
        rot:true
    },
    isDisabled:false,
    isActive:false,
    controlsNode:null,
    ctor:function(){
        this._super();
        this._anchorPoint= cc.p(0.5,0.5)
    },
    drawControls: function(){
        if(this.controlsNode) return;
        this.controlsNode = new ControlsRect(this.controlPoints);
        this.controlsNode.setContentSize(this._contentSize);
        this.controlsNode.draw();
        this.addChild(this.controlsNode);
    },
    removeDrawControls: function(){
        this.removeChild(this.controlsNode);
        this.controlsNode = null;
    },
    setActive:function(event){
        this.isActive = true;
        this.mouseX = event._x - this.x
        this.mouseY = event._y - this.y
        this.zIndex = ++cc.editorManager._maxZ;
        this.drawControls();
    },
    unSetActive:function(){
        this.isActive = false;
        this.removeDrawControls();
    }

})