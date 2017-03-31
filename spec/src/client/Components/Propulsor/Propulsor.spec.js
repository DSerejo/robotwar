'use strict';
import {expect,_p} from '../../../../helpers/testhelpers.js';
const id = 1;
const pos = {x:1,y:1};
const angle = 0;
const force = 40;
const actionKeys = {start:87};

describe('Populsor graphic',function(){
    var world,manager,Propulsor,Materials,EntityManager;
    before(function(){
        Propulsor = require('../../../../../src/client/Components/Propulsor/Propulsor').default;
        Materials = require('../../../../../src/common/Physics/Materials').default;
        EntityManager = require('../../../../../src/common/Physics/EntityManager');
        world = new _p.b2World(_p.gravity);
        manager = new EntityManager();
    });

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
