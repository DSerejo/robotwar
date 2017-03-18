importBox2d();
var Entity = require(testDir(__dirname) + '/Entity');
var Materials = require(testDir(__dirname) + '/Materials');
var DamageCalculator = require(testDir(__dirname) + '/DamageCalculator');
describe('Damage calculator',function(){
    var world,entity,damageCalculator;


    world = new b2World(gravity);
    entity = new Entity(world);
    entity.init(1,1,1,1,{x:1,y:1},1,Materials.wood(),'type');
    entity.addBody();

    damageCalculator = new DamageCalculator();
    damageCalculator.ctor(entity);

    it('Calculates max force supported',function(){
        var wood = Materials.wood();
        expect(damageCalculator.maxForceSupported()).to.equal(wood.fakeFractionStrain);
    });
    xit('Calculates damage',function(){})

});

