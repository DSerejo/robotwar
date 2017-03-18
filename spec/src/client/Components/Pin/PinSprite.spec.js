'use strict';
mockCC();
var PinSprite = require(testDir(__dirname) + '/PinSprite');

const r = 1;
const fillColor = '';
describe('PinSprite',function(){
    it('creates the sprite',function(){
        var sprite = new PinSprite(r,fillColor);
        expect(sprite.dn).to.not.be.null
    })
});


