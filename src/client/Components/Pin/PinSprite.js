var cc = require('../../../../constants').cc;
const _circleColor = '#ff878b'
class PinSprite extends cc.Node{
    constructor (radius,circleColor) {
        super();
        this.radius = radius;
        this.circleColor = circleColor || _circleColor;
        this.draw()
    }
    draw(){
        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawDot(cc.p(this.radius,this.radius), this.radius,cc.color(this.circleColor));
        this._contentSize = cc.size(this.radius*2,this.radius*2)
    }
}
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = PinSprite;
}