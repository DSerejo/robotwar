var BaseObject = cc.Class.extend({
    options:{
        action_keys:null
    },
    ctor:function(options){
        var a = this.isTouched;
    },
    isTouched:function(p){
        var rect = new cc.Rect(0,0,this.sprite._contentSize.width, this.sprite._contentSize.height),
            localPoint = this.sprite.convertToNodeSpace(p)
        return cc.rectContainsPoint(rect,localPoint);
    },
    isSelected:function(){
        return this.sprite&&this.sprite.getChildByName('selected') !== null
    },
    select:function(){
        this.unSelect();
        var sprite  = new BoxSprite(this.sprite.getContentSize().width,this.sprite.getContentSize().height,'#1c59bc',50);
        this.sprite.addChild(sprite,1,'selected')
        this.selectedNode = sprite;
    },
    updateBodyFromSprite:function(){
        throw "Must be implemented";
    },
    unSelect:function(){
        if(this.selectedNode){
            this.selectedNode.removeFromParent()
        }
        this.selectedNode = null
    },recreateSprite:function(){
        var oldSpriteConfig = this.removeSprite();
        this.createSpriteObject();
        if(this.body)
            this.sprite.setPosition(cc.convertMetersToPoint(this.body.GetPosition()));
        else{
            this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
        }
        if(!this.options.delayedPosition){
            this.sprite.init(this);
        }
        if(oldSpriteConfig && oldSpriteConfig.parent){
            oldSpriteConfig.parent.addChild(this.sprite,oldSpriteConfig.zOrder);
            oldSpriteConfig.isSelected && this.select()
        }
    },removeSprite :function(){
        if(this.sprite){
            var parent = this.sprite.parent,
                zOrder = this.sprite.getLocalZOrder(),
                isSelected = this.isSelected();
            this.sprite.removeAllChildren();
            this.sprite.removeFromParent();
            this.sprite = null;
            return {parent:parent,zOrder:zOrder,isSelected:isSelected}
        }
    },
    addX:function(dX){
        this.sprite.setPosition(cc.convertMetersToPoint(cc.p(this.pos.x+dX,this.pos.y)));
        this.updateBodyFromSprite();
    },
    addY:function(dY){
        this.sprite.setPosition(cc.convertMetersToPoint(cc.p(this.pos.x,this.pos.y+dY)));
        this.updateBodyFromSprite();
    },
    addAngle:function(dA){
        this.sprite.setRotation(-this.angle + dA);
        this.updateBodyFromSprite();
    }
})
var a = 0;