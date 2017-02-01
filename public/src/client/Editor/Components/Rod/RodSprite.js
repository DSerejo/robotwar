var RodSprite = cc.Node.extend({
    con1:null,
    con2:null,
    bar:null,
    ctor:function(options,parent){
        this._super();
        this.options = options;
        this.parentBody = parent;
        this.create();
        this._anchorPoint = cc.p(0.5,0.5)
    },
    create:function(){
        this.con1 = this.addConnection();
        this.con2 = this.addConnection();
        this.positionConnection(this.con1,true,this.options['con1']);
        this.positionConnection(this.con2,false,this.options['con2']);
        this.addBar();
    },
    recreate:function(){
        var newPosition = this.convertToWorldSpace(cc.pMidpoint(this.con1.getPosition(),this.con2.getPosition())),
            normal = cc.pForAngle(cc.angleInRadiansBetweenToPoints(this.con1.getPosition(),this.con2.getPosition())),
            distance = cc.pDistance(this.con1.getPosition(),this.con2.getPosition())

        this.options['con1'] = {position:cc.pSub(cc.p(0,0),cc.pMult(normal,distance/2))}
        this.options['con2'] = {position:cc.pAdd(cc.p(0,0),cc.pMult(normal,distance/2))}
        this.removeAllChildren(true);
        this.setPosition(newPosition);
        this.create()
    },
    addConnection:function(){
        var con = new RodConnection();
        this.addChild(con);
        con.zIndex =1
        con.init()
        return con;
    },
    positionConnection:function(con,start,conOptions){
        var position;
        if(conOptions){
            position = conOptions.position;
        }else{
            var x=50 * (start?-1:1);
            position = cc.p(x,start?-50:50);
        }
        con.setPosition(position);
    },
    addBar:function(){
        this.bar = new Bar(this.con1.getPosition(),this.con2.getPosition());
        this.addChild(this.bar);
        this.bar.zIndex = 0;
        window.bar = this.bar;
        this.positionBar();

    },
    drawBar:function(){
        if(this.bar)
            this.removeChild(this.bar);
        this.addBar();
        if(this.parentBody)
            this.parentBody.updateShape();
    },
    positionBar:function(){
        this.bar.setPosition(this.con1.getPosition());
    },
    getPosition:function(){
        if(this.bar){
            var box = this.bar.getBoundingBoxToWorld();
            return {
                x:box.x + box.width/2,
                y:box.y + box.height/2
            }
        }
        else
            return this._super();
    },
    setPosition:function(pos){
        this._super(pos);
    },
    getRotation:function(){
        return this.bar.getRotation()
    },
    setRotation:function(angle){
        this._super(angle)
    }



})