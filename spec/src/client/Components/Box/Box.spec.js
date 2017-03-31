'use strict';
import {expect,_p} from '../../../../helpers/testhelpers.js';
const id = 1;
const w = 1;
const h = 1;
const pos = {x:1,y:1};
const angle = 1;
const type = 'box';

describe('Box',function(){
    var world,manager,Box,Materials,EntityManager,material;

    before(function(){
        Box = require('../../../../../src/client/Components/Box/Box').default;
        Materials = require('../../../../../src/common/Physics/Materials').default;
        EntityManager = require('../../../../../src/common/Physics/EntityManager');
        material = Materials.wood();
        manager = new EntityManager();
    });
    world = new _p.b2World(_p.gravity);

    it('creates a boxy',function(){
        var box = new Box(id,w,h,pos,angle,material,type,world);
        expect(box.body.constructor.name).to.equal('b2Body');
        expect(box.sprite).to.not.be.null;
    });
    it('creates a sprite',function(){
        var box = new Box(id,w,h,pos,angle,material,type,world);
        box.sprite = null;
        box.createSpriteObject();
        expect(box.sprite).to.not.be.null;
    });
    it('updates body from sprite',function(){
        var box = new Box(id,w,h,pos,angle,material,type,world);
        box.setEntityManager(manager);
        box.sprite.setPosition((pos.x+1)*_p.PMR,(pos.y+1)*_p.PMR);
        box.updateBodyFromSprite();
        expect(box.body.GetPosition()).to.shallowDeepEqual({'x':pos.x*2,'y':pos.y*2});
    });
});
