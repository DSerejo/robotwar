var CircleSprite = cc.Node.extend({
    con1: null,
    con2: null,
    bar: null,
    circleColor:'#6D6D6D',
    ctor: function (options, parent) {
        this._super();
        this.options = options;
        this.radius = options.radius
        this.circleColor = this.circleColor || options.circleColor;
        this.draw()

    },
    init:function(){
        this.setAnchorPoint(0.5,0.5)
    },
    draw:function(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        var fillColorObj = cc.hexToColor(this.circleColor);
        fillColorObj.a = 125
        dn.drawDot(cc.p(this.radius,this.radius), this.radius,fillColorObj);
        this._contentSize = cc.size(this.radius*2,this.radius*2)

    }
})