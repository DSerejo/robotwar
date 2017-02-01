var ControlScale = ControlPoint.extend({
    scaleCoef:1,
    _width:5,
    strokeWidth:1,
    strokeColor:"#6D6D6D",
    backgroundColor:"#EFEFEF",
    draw:function(){
        this.drawRect(cc.p(0,0), cc.p(this._width,this._width), cc.color(this.backgroundColor), this.strokeWidth, cc.color(this.strokeColor));
    },
    _setActive:function(event){
        this._super(event);
        this.startScale = this._getStartScale();
    },
    _getStartScale: function(){
        return  {
            x:this.controlledObject.getScaleX(),
            y:this.controlledObject.getScaleY()
        }
    },
    onMouseMove:function(event){
        if(this.isActive){
            var dScale = this.getDeltaScale(event);
            this.scale(dScale)
            event.stopPropagation()
        }
    },
    getDeltaScale:function(event){
        return {
            x:(event._x - this.center.x) / (this.startPoint.x  - this.center.x ),
            y:(event._y - this.center.y + 9.5) / (this.startPoint.y - this.center.y + 9.5)
        }
    },
    scale:function(dScale){
        if(this.config.scalePolicy && this.config.scalePolicy.x){
            var scaleX = dScale.x * this.startScale.x;
            this.controlledObject.setScaleX(scaleX);
        }
        if(this.config.scalePolicy && this.config.scalePolicy.y){
            var scaleY = dScale.y * this.startScale.y;
            this.controlledObject.setScaleY(scaleY);
        }

    }

})