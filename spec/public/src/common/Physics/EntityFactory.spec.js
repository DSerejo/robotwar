var EntityFactory = require(testDir(__dirname) + '/EntityFactory');
var EntityManager = require(testDir(__dirname) + '/EntityManager');
describe('Entity factory',function(){
    var world,factory,manager;
    importBox2d();
    world = new b2World(gravity);

    manager = new EntityManager();

    factory = new EntityFactory(manager);
    factory.setWorld(world);

    it('Creates a box',function(){
        var box = factory.box({"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1})
        expect(box.toObject()).to.shallowDeepEqual({"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1});
    });
    it('Creates a propulsor',function(){
        var propulsor = factory.propulsor({"angle":1,"position":{"x":1,"y":1}});
        expect(propulsor.toObject()).to.shallowDeepEqual({"angle":1,"position":{"x":1,"y":1},class:'propulsor'});
    });
    it('Creates a pin',function(){
        var pin = factory.pin({"position":{"x":1,"y":1}});
        expect(pin.toObject()).to.shallowDeepEqual({"position":null,class:'pin'});
    });
    it('Creates a pin with bodies',function(){
        manager.addNewEntity(factory.box({id:'1',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.addNewEntity(factory.box({id:'2',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        var pin = factory.pin({"position":{"x":1,"y":1},bodyAId:'1',bodyBId:'2'});
        expect(pin.toObject()).to.shallowDeepEqual({"position":{"x":1,"y":1},bodyAId:'1',bodyBId:'2',class:'pin'});
    });

});

