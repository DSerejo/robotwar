'use strict';
importBox2d();
mockCC();
var Box = require(testDir(__dirname) + '/Box');
var Materials = require(testDir(__dirname) + '/../../../common/Physics/Materials');
var EntityManager = require(testDir(__dirname) + '/../../../common/Physics/EntityManager');
const id = 1;
const w = 1;
const h = 1;
const pos = {x:1,y:1};
const angle = 1;
const material = Materials.wood();
const type = 'box';
describe('Box',function(){
    var world,manager;

    world = new b2World(gravity);
    manager = new EntityManager();
    it('creates a boxy',function(){
        var box = new Box(id,w,h,pos,angle,material,type,world);
        expect(box.body.constructor.name).to.equal('b2Body');
        expect(box.sprite).to.not.be.null;
    })
    it('creates a sprite',function(){
		var box = new Box(id,w,h,pos,angle,material,type,world);
		box.sprite = null;
		box.createSpriteObject()
		expect(box.sprite).to.not.be.null;
    })
    it('updates body from sprite',function(){
    	var box = new Box(id,w,h,pos,angle,material,type,world);
    	box.setEntityManager(manager);
    	box.updateBodyFromSprite();
    	expect(box.toObject()).to.shallowDeepEqual({"class":"box","material":"wood","angle":0,"position":{"x":1,"y":1},"width":7.5,"height":7.5})
    })
});
