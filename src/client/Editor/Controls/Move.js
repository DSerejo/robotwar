var Control = require('./Control');
class Move extends Control{
    constructor(){
        super();
        this.fillColor = "#CCCCCC";
        this.fileName = 'Move';
        this._name = 'Move';
    }
    getDeltaPosition(event){
        return cc.p(event._x-event._prevX,event._y - event._prevY)
    }
    transform(event,object){
        this.move(event,object)
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }
    move(event,object){
        var dPos = this.getDeltaPosition(event),
            curPos = object.sprite.getPosition()
        object.sprite.setPosition(cc.p(curPos.x+dPos.x,curPos.y+dPos.y))
    }
}
module.exports = MoveButton;