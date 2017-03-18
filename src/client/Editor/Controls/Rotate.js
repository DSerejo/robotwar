var Control = require('./Control');
class Rotate extends Control{
    getAngle(event,object){
        var currentPoint = cc.p(event._x,event._y),
            prevPoint = cc.p(event._prevX,event._prevY),
            center = object.sprite.getPosition();
        return -1 * cc.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(center,prevPoint,center,currentPoint);
    }
    transform(event,object){
        this.rotate(event,object);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }
    rotate(event,object){
        var dAngle = this.getAngle(event,object);
        object.sprite.setRotation(object.sprite.getRotation() + dAngle)
    }
}
module.exports = Rotate;