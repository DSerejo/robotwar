
describe('Pin',function(){
    importBox2d();
    var world,pin,bodyA,bodyB;
    var Pin = require(testDir(__dirname) + '/Pin');
    var Box = require(testDir(__dirname) + '/Box');
    var Materials = require(testDir(__dirname) + '/../Physics/Materials');
    world = new b2World(gravity);

    it('Creates a pin',function(){
        pin = new Pin(1,{x:1,y:1},null,world);
        expect(pin.type).to.equal('pin');
    });
    it('Creates a pin that attaches bodies',function(){
        bodyA = new Box(1,1,1,{x:1,y:1},0,Materials.wood(),null,world);
        bodyB = new Box(2,1,1,{x:1,y:1},0,Materials.wood(),null,world);
        bodyA.addBody();
        bodyB.addBody();
        pin = new Pin(3,{x:1,y:1},[bodyA.body.GetFixtureList(),bodyB.body.GetFixtureList()],world);
        expect(pin.toObject()).to.shallowDeepEqual({"bodyAId":1,"bodyBId":2});
    });
    it('Removes joint',function(){
        expect(bodyA.body.GetJointList().joint.m_userData.id).to.equal(3)
        pin.remove();
        expect(bodyA.body.GetJointList()).to.be.null
    })
});

