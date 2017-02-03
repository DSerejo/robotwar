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
        var sprite  = new BoxSprite(_.extend({},this.sprite.getContentSize(),{fillColor:'#4286f4'}))
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
    },
    lalala:function(options){
        this.options = _.extend({},this.options,options);
    }
})
var a = 0;