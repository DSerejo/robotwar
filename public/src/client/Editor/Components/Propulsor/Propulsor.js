var Propulsor = Box.extend({
    fixedWidth:30,
    fixedHeight:10,
    countImpulse:0,
    isOn:false,
    ctor: function (world, options) {
        this.setOptions({
            force:50
        })
        this._super(world,options)


    },
    update:function(dt){
        this._super(dt)
        if(this.isOn){
            this.applyForce()
        }
    },

    createSpriteObject:function(){
        var options = this.addFixedOptions(this.options)
        this.sprite = new BoxSprite(options,this);
    },
    addBody:function(options){
        options = this.addFixedOptions(options)
        this.makeBody(options.width,options.height,options.type,options.density,options.restitution,options.friction,options.position,options.angle||0,this);
    },
    addFixedOptions:function(options){
        return _.extend({},options,{
            width:this.fixedWidth*WORLD_SCALE,
            height:this.fixedHeight*WORLD_SCALE,
            fillColor:'#fff844'
        })
    },
    onKeyPressed:function(key){
        this.startStopPropulsor(key,true);
    },
    onKeyReleased:function(key){
        this.startStopPropulsor(key,false);
    },
    startStopPropulsor:function(keyPressed,start){
        var actionKey = this.getActionKey();
        if(!actionKey) return;
        switch (keyPressed){
            case actionKey:
                this.isOn = start
                break;
            default:
                break;
        }
    },
    getActionKey:function(){
        if(this.options.action_keys && this.options.action_keys.start)
            return this.options.action_keys.start;

    },
    applyForce:function(){
        var direction = cc.pRotateByAngle(cc.p(0,1),cc.p(0,0),this.body.GetAngle())
        this.body.ApplyForce(cc.pMult(direction,this.options.force),this.body.GetWorldCenter())

    }
})