
describe('Propulsor',function(){
    importBox2d();
    var world,propulsor;
    var keyCode = 87,
        force = 40;
    var Propulsor = require(testDir(__dirname) + '/Propulsor').PropulsorPhysics;
    var Materials = require(testDir(__dirname) + '/../Physics/Materials');
    world = new b2World(gravity);
    propulsor = new Propulsor(1,{x:1,y:1},0,force,null,world);
    propulsor.addBody();

    it('Creates a propulsor',function(){
        expect(propulsor.type).to.equal('propulsor');
        expect(propulsor.force).to.equal(force);
    });
    it('Sets action keys',function(){
        propulsor.setActionKeys({start:keyCode});
        expect(propulsor.actionKeys.start).to.equal(keyCode);
    });
    it('Starts motor on key pressed',function(){
        propulsor.onKeyPressed(keyCode);
        expect(propulsor.isOn).to.be.true;
    });
    it('Stops motor on key released',function(){
        propulsor.onKeyReleased(keyCode);
        expect(propulsor.isOn).to.be.false;
    });
    it('Applies force if on',function(){
        propulsor.onKeyPressed(keyCode);
        propulsor.performAction();
        expect(propulsor.body.m_force.y).to.equal(force);
    })

});

