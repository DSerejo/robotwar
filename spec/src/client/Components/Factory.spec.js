'use strict';
import {expect,_p} from '../../../helpers/testhelpers.js';
const w = 1;
const h = 1;
const pos = {x:0,y:0};
const angle = 0;
var factory,manager,world,Factory,EntityManager;
var loadModules = () =>{
    Factory = require('../../../../src/client/Components/Factory').default;
    EntityManager = require('../../../../src/common/Physics/EntityManager');
}
describe('Factory',function(){

    before(function(){
        loadModules();
        manager = new EntityManager();
        factory = new Factory(manager);
        world = new _p.b2World(_p.gravity);
        factory.setWorld(world);
    });
    world = new _p.b2World(_p.gravity);
    it('creates a box',function(){
        var box = factory.box({width:w,height:h,position:pos,angle:angle,material:'wood'});
        expect(box.body.constructor.name).to.equal('b2Body');
        expect(box.sprite).to.not.be.null;
    });
    it('creates a propulsor',function(){
        var propulsor = factory.propulsor({width:w,height:h,position:pos,angle:angle,material:'wood'});
        expect(propulsor.body.constructor.name).to.equal('b2Body');
        expect(propulsor.sprite).to.not.be.null;
    });
    it('creates a pin',function(){
        var pin = factory.pin({position:pos});
        expect(pin.sprite).to.not.be.null;
    });
});
