'use strict';
mockCC();
var BoxSprite = require(testDir(__dirname) + '/BoxSprite');

const w = 1;
const h = 1;
const fillColor = '';
const a = 255;
describe('Box',function(){
    it('creates the sprite',function(){
        var sprite = new BoxSprite(w,h,fillColor,a);
        expect(sprite.dn).to.not.be.null
    })
});


