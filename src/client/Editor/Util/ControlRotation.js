var ControlRotation = ControlPoint.extend({
    radius:4,
    draw:function(){
        this.drawCircle(cc.p(2.5,2.5), this.radius,1,10,false,1,cc.color("#6D6D6D"));
    },
    _setActive:function(event){
        this._super(event);
        this.startAngle = this.controlledObject.getRotation()
    },
    onMouseMove:function(event){
        if(this.isActive){
            var angle = this.getAngle(event);
            this.rotate(angle)
            event.stopPropagation()
        }
    },
    getAngle:function(event){
        var currentPoint = cc.p(event._x,event._y);
        return -1 * cc.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(this.center,this.startPoint,this.center,currentPoint);
    },
    rotate:function(angle){
        angle += this.startAngle;
        this.controlledObject.setRotation(angle)
    }
})