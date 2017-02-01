var PinSprite = cc.Node.extend({
    circleColor:'#ff878b',
    ctor: function (options) {
        this._super();
        this.options = options;
        this.radius = options.radius
        this.circleColor = this.circleColor || options.circleColor;
        this.draw()

    },
    draw:function(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawDot(cc.p(this.radius,this.radius), this.radius,cc.color(this.circleColor));
        this._contentSize = cc.size(this.radius*2,this.radius*2)
    }
})