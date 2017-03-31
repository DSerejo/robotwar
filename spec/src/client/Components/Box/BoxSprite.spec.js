'use strict';
import {_p,expect} from '../../../../helpers/testhelpers';



const w = 1;
const h = 1;
const fillColor = '';
const a = 255;
describe('BoxSprite',function(){
    it('creates the sprite',function(){
        const BoxSprite = require('../../../../../src/client/Components/Box/BoxSprite');
        var sprite = new BoxSprite(w,h,fillColor,a);
        expect(sprite.dn).to.not.be.null;
    });
});


