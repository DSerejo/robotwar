var BoxSprite = cc.Node.extend({
    dn:null,
    fillColor:'#EFEFEF',
    ctor:function(width,height,fillColor){
        this._super()
        this.dn = new cc.DrawNode()
        this.fillColor = fillColor || this.fillColor;
        this.addChild(this.dn)
        this.draw(width,height);
    },
    init:function(parent){
        this.setAnchorPoint(cc.p(0.5,0.5))
        this.setRotation(-parent.angle)
    },
    draw:function(width,height){
        var fillColor = this.fillColor;
        this.dn.setContentSize(width,height)
        this.setContentSize(width,height)
        var fillColorObj = cc.hexToColor(fillColor);
        fillColorObj.a = 125
        this.dn.drawRect(cc.p(0,0), cc.p(width,height), fillColorObj, 1, cc.color("#6D6D6D"));

    },

})