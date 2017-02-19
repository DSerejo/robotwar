var DamageSprite = cc.Class.extend({
    timeToLiveInMilliseconds: 500,
    minimumDamageColor:'#ffd4ce',
    maximumDamageColor:'#c41600',
    ctor:function(damage,object){
        var color = this.calculateDamageColor(damage),
            sprite = object.createSpriteObject(color,true);
        console.log(object.id,damage);
        object.sprite.addChild(sprite,2);
        setTimeout(function(){
            sprite.removeFromParent()
        },this.timeToLiveInMilliseconds);
    },
    calculateDamageColor(damage){

        return cc.lerpColor(this.minimumDamageColor,this.maximumDamageColor,Math.min(damage,1));

    }
});