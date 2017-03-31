'use strict';
import {expect,_p} from '../../../../helpers/testhelpers.js';
describe('Pin',function(){
    var world,bodyA,bodyB,Pin,Box,Materials;
    before(function(){
        Pin = require ('../../../../../src/client/Components/Pin/Pin.js').default;
        Box = require('../../../../../src/common/Components/Box');
        Materials = require('../../../../../src/common/Physics/Materials').default;
        world = new _p.b2World(_p.gravity);
    });

    function createPinWithBodies(bodyPos,pinPos){
        var bodyPos = bodyPos || {x:1,y:1};
        var pinPos = pinPos || {x:1,y:1};
        world = new _p.b2World(_p.gravity);
        bodyA = new Box(1,1,1,bodyPos,0,Materials.wood(),null,world);
        bodyB = new Box(2,1,1,bodyPos,0,Materials.wood(),null,world);
        bodyA.addBody();bodyB.addBody();    
        return new Pin(3,pinPos,[bodyA.body.GetFixtureList(),bodyB.body.GetFixtureList()],world);
    }
    it('Creates a pin',function(){
        var pin = new Pin(1,{x:1,y:1},null,world);
        expect(pin.type).to.equal('pin');
        expect(pin.sprite).to.not.be.null;
    });
    it('Updates position according to the bodies',function(){
        const NEWXY = 2;
        var pin = createPinWithBodies();
        bodyA.body.SetPosition({x:NEWXY,y:NEWXY});
        pin.update();
        expect(pin.sprite.getPosition()).to.shallowDeepEqual({x:PMR*NEWXY,y:PMR*NEWXY})
    });
    it('Updates joint position from sprite',function(){
        const NEWXY = 400;
        var pin = createPinWithBodies();
        pin.sprite.setPosition({x:NEWXY,y:NEWXY});
        pin.updateBodyFromSprite();
        expect(pin.toObject()).to.shallowDeepEqual({position:{x:NEWXY/PMR,y:NEWXY/PMR}});
    });
    it('Attach bodies if dropped over them',function(){
        const NEWXY = 400;
        bodyA = new Box(1,1,1,{x:10,y:10},0,Materials.wood(),null,world);
        bodyB = new Box(2,1,1,{x:10,y:10},0,Materials.wood(),null,world);
        bodyA.addBody();bodyB.addBody();    
        var pin = new Pin(1,{x:1,y:1},null,world);
        expect(pin.toObject()).to.shallowDeepEqual({bodyAId:null});
        pin.sprite.setPosition({x:NEWXY,y:NEWXY});
        pin.updateBodyFromSprite();
        expect(pin.toObject()).to.shallowDeepEqual({bodyAId:2});
    })
});
