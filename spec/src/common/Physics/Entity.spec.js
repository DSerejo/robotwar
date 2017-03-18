var Entity = require(testDir(__dirname) + '/Entity');
var Materials = require(testDir(__dirname) + '/Materials');
describe('Entity',function(){
    var world;
    importBox2d();
    world = new b2World(gravity);
    var entity = new Entity(world);
    entity.init(1,1,1,1,{x:1,y:1},1,Materials.wood(),'type');

    it('Creates an entity',function(){
        expect(entity.world.constructor.name).to.equal('b2World');
    });
    it('Sets entity properties',function(){
        expect(entity.id).to.equal(1);
        expect(entity.w).to.equal(1);
        expect(entity.h).to.equal(1);
        expect(entity.radius).to.equal(1);
        expect(entity.pos.x).to.equal(1);
        expect(entity.angle).to.equal(1);
        expect(entity.material.name).to.equal('wood');
        expect(entity.type).to.equal('type');
        expect(entity.body).to.be.null;
    });
    it('Creates default body',function(){
        entity.addBody();
        expect(entity.body).to.not.be.null;
    });
    it('Converts to object',function(){
        expect(entity.toObject()).to.shallowDeepEqual({"class":"type","material":"wood","angle":1,"position":{"x":1,"y":1},"lv":{"x":0,"y":0},"av":0,"id":1,"type":2,"width":1,"height":1});
    });

});
