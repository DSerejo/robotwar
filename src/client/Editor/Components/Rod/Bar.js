var Bar = cc.Node.extend({
    dn:null,
    config:{
        height:3
    },
    start:null,
    end:null,
    ctor:function(start,end,config){
        this._super()
        _.extend(this.config,config);
        this.dn = new cc.DrawNode()
        this.addChild(this.dn)
        this.start = start;
        this.end = end;
        this.draw(start,end)
    },
    draw:function(start,end){
        var distance = cc.pDistance(start,end);
        this._contentSize = cc.size(distance,this.config.height)
        this.setAnchorPoint(cc.p(0,0.5))
        this.dn.drawRect(cc.p(0,0), cc.p(distance,this.config.height), cc.color("#EFEFEF"), 1, cc.color("#6D6D6D"));
        this.setRotation(this.calcRotation(start,end));
    },
    getHeight:function(){
        return this.config.height
    },
    calcRotation:function(start,end){
        return cc.radiansToDegrees(-cc.pToAngle(cc.pSub(end,start)))
    }
})