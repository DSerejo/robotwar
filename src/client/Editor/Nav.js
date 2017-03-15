var Background = cc.LayerColor.extend({
    _size:null,
    init:function () {
        this._size = cc.director.getWinSize();
        this.setWidth()
        this.draw()
    },
    setWidth:function(){
        this.width = Math.min(this._size.width/4,50);
    },
    draw:function(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawRect(cc.p(0,0), cc.p(this._contentSize.width,this._contentSize.height), cc.color("#EFEFEF"), 3, cc.color("#6D6D6D"));
    }
})
var Nav = cc.Layer.extend({
    init:function(){
        var background = new Background(cc.color(255,255,0,255));
        this.addChild(background);
        background.init();
    }
});