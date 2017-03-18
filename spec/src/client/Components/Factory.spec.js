'use strict';
mockCC();
importBox2d();
var Factory = require(testDir(__dirname) + '/Factory');
var EntityManager = require(testDir(__dirname) + '/../../common/Physics/EntityManager');
var Materials = require(testDir(__dirname) + '/../../common/Physics/Materials');
const w = 1;
const h = 1;
const pos = {x:0,y:0};
const angle = 0;
const fillColor = '';
const a = 255;
describe('Factory',function(){
	var factory,manager,world;
	manager = new EntityManager();
	factory = new Factory(manager);
	world = new b2World(gravity);
	factory.setWorld(world);
    it('creates a box',function(){
        var box = factory.box({width:w,height:h,position:pos,angle:angle,material:'wood'});
        expect(box.body.constructor.name).to.equal('b2Body');
        expect(box.sprite).to.not.be.null;
    })
    it('creates a propulsor',function(){
        var propulsor = factory.propulsor({width:w,height:h,position:pos,angle:angle,material:'wood'});
        expect(propulsor.body.constructor.name).to.equal('b2Body');
        expect(propulsor.sprite).to.not.be.null;
    })
    it('creates a pin',function(){
        var pin = factory.pin({position:pos});
        expect(pin.sprite).to.not.be.null;
    })
});


