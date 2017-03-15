var RotateButton = ControlButton.extend({
    fillColor:"#000000",
    _name:"Rotate",
    getAngle:function(event,object){
        var currentPoint = cc.p(event._x,event._y),
            prevPoint = cc.p(event._prevX,event._prevY),
            center = object.sprite.getPosition()
        return -1 * cc.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(center,prevPoint,center,currentPoint);
    },
    onActive:function(){
        console.log('Rotate')
    },
    onInactive:function(){
        console.log('Rotate')
    },
    transform:function(event,object){
        this.rotate(event,object)
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    },
    rotate:function(event,object){
        var dAngle = this.getAngle(event,object)
        object.sprite.setRotation(object.sprite.getRotation() + dAngle)
    }
})