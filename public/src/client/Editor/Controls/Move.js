var MoveButton = ControlButton.extend({
    fillColor:"#CCCCCC",
    fileName:'Move',
    _name:'Move',
    getDeltaPosition:function(event){
        return cc.p(event._x-event._prevX,event._y - event._prevY)
    },
    transform:function(event,object){
        this.move(event,object)
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    },
    move:function(event,object){
        var dPos = this.getDeltaPosition(event),
            curPos = object.sprite.getPosition()
        object.sprite.setPosition(cc.p(curPos.x+dPos.x,curPos.y+dPos.y))
    }
})