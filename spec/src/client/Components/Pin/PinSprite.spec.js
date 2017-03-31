'use strict';
import {expect,_p} from '../../../../helpers/testhelpers.js';
const r = 1;
const fillColor = '';
describe('PinSprite',function(){
    var PinSprite;
    before(function(){
        PinSprite = require('../../../../../src/client/Components/Pin/PinSprite');
    });
    it('creates the sprite',function(){
        var sprite = new PinSprite(r,fillColor);
        expect(sprite.dn).to.not.be.null
    });
});


