var Rod = BoxBody.extend({
    ctor:function(world,options){
        this._super(world);
        this.options = options;
        this.sprite = new RodSprite(options,this);
        if(options.position)
            this.sprite.setPosition(options.position)
        window.sprite = this.sprite
        this.addBody(options);
    },
    addBody:function(options){
        var size = this.sprite.bar.getContentSize(),
            angle = this.sprite.getRotation(),
            position = this.sprite.getPosition()
        this.setRealPositionDiff()
        this.makeBody(size.width,size.height,options.type,1,0,1,position,-angle);
    },
    setRealPositionDiff:function(){
        //this.realPosition = cc.pSub(this.sprite._position,this.sprite.getPosition());
        this.realAngle = this.sprite._rotationX - this.sprite.getRotation();
    },
    updateShape:function(){
        this.removeBody();
        this.addBody(this.options);
    },
    _setPosition: function(p){
        //this.sprite.setPosition(cc.pAdd(p,this.realPosition))
        this.sprite.setPosition(p)
    },
    _setRotation: function(a){
        this.sprite.setRotation(a + this.realAngle)
    }

})