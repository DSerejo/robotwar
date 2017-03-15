var Wheel = CircleBody.extend({

    ctor:function(world,options){
        this._super(world);
        this.setOptions(options)
        this.recreateSprite()
    },
    createSpriteObject:function(){
        this.sprite = new CircleSprite(this.options,this);
    },
    init:function(){
        this.addBody(this.options);
    },
    addBody:function(options){
        this.makeBody(options.radius,options.type,options.density,options.restitution,options.friction,options.position,30,this);
    },
    updateBodyFromSprite:function(){
        if(!this.sprite)
            return;
        this.removeBody();
        this.updateOptions()
        this.addBody({
            radius:this.options.radius,
            position:this.options.position,
            type:this.options.type,
            angle:-this.options.angle
        })
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
        this.sprite.setRotation(a)
    },
    updateOptions:function(){
        this.options = _.extend({},this.options,{
            position:cc.pMult(this.sprite.getPosition(),WORLD_SCALE),
            angle:-this.sprite.getRotation(),
            radius:(this.sprite.getContentSize().width/2)*WORLD_SCALE
        },this.sprite.getContentSize())
    },
    addX:function(dX){
        return Math.max(5,this.options.radius+dX)
    },onKeyPressed:function(key){
        switch (key){
            case 87:
                this.body.ApplyForce(new b2Vec2(0,-1000),this.body.GetWorldCenter())
                break;
            default:
                break;

        }
    },

})