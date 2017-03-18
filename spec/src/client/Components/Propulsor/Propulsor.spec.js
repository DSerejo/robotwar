'use strict';
importBox2d();
mockCC();
var Propulsor = require(testDir(__dirname) + '/Propulsor');
var Materials = require(testDir(__dirname) + '/../../../common/Physics/Materials');
var EntityManager = require(testDir(__dirname) + '/../../../common/Physics/EntityManager');
const id = 1;
const pos = {x:1,y:1};
const angle = 0;
const force = 40;
const actionKeys = {start:87};

describe('Populsor graphic',function(){
    var world,manager;

    world = new b2World(gravity);
    manager = new EntityManager();
    it('creates a propulsor',function(){
        var propulsor = new Propulsor(id,pos,angle,force,actionKeys,world);
        expect(propulsor.body.constructor.name).to.equal('b2Body');
        expect(propulsor.sprite).to.not.be.null;
    })
    it('Apply force on update if on',function(){
    	var propulsor = new Propulsor(id,pos,angle,force,actionKeys,world);
    	propulsor.isOn = true;
    	propulsor.update();
    	expect(propulsor.body.m_force.y).to.equal(force)
    })
});
