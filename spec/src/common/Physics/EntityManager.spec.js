var EntityFactory = require(testDir(__dirname) + '/EntityFactory');
var EntityManager = require(testDir(__dirname) + '/EntityManager');
var World = require(testDir(__dirname) + '/../World');
var sinon = require('sinon');
describe('Entity manager',function(){
    var world,factory,manager;
    importBox2d();
    function initialize(){
        world = new b2World(gravity);
        manager = new EntityManager();
        factory = new EntityFactory(manager);
        factory.setWorld(world);
    }
    initialize();

    it('Adds new entity',function(){
        manager.addNewEntity(factory.box({id:'1',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        expect(manager.getWithId('1').toObject()).to.shallowDeepEqual({"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1});
        expect(World.findWorldBody(world,1).constructor.name).to.equal('b2Body');
    });
    it('Maps action key',function(){
        manager.addNewEntity(factory.propulsor({id:11,"angle":1,"position":{"x":1,"y":1},actionKeys:{"start":87}}));
        expect(manager.actionKeys['87'][0].toObject()).to.shallowDeepEqual({"angle":1,"position":{"x":1,"y":1},actionKeys:{"start":87}});
    });
    it('Adds new joint',function(){
        manager.addNewJoint(factory.pin({id:'3',"position":{"x":1,"y":1}}));
        expect(manager.getWithId(3).toObject()).to.shallowDeepEqual({class:'pin'});
    });
    it('Removes an entity',function(){
        manager.addNewEntity(factory.box({id:'4',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.removeEntity(manager.getEntityWithId('4'));
        expect(manager.getWithId('4')).to.be.null;
        expect(World.findWorldBody(world,4)).to.be.undefined;
    });
    it('Removes a joint',function(){
        manager.addNewEntity(factory.box({id:'5',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.addNewEntity(factory.box({id:'6',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.addNewJoint(factory.pin({id:'7',"position":{"x":1,"y":1},bodyAId:'5',bodyBId:'6'}))
        expect(manager.getWithId(7).toObject()).to.shallowDeepEqual({class:'pin'});
        manager.removeJoint(manager.getWithId(7));
        expect(manager.getWithId('7')).to.be.null;
    });
    it('Removes dead bodies',function(){
        manager.addNewEntity(factory.box({id:'8',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.graveyard['8'] = manager.getEntityWithId(8);
        manager.removeDeadBodies();
        expect(manager.getWithId('8')).to.be.null;
    });
    it('Removes dead bodies',function(){
        manager.addNewEntity(factory.box({id:'8',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.graveyard['8'] = manager.getEntityWithId(8);
        manager.removeDeadBodies();
        expect(manager.getWithId('8')).to.be.null;
    });
    it('Updates all',function(){
        initialize();
        manager.addNewEntity(factory.box({id:'1',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.addNewEntity(factory.box({id:'2',"material":"wood","angle":1,"position":{"x":1,"y":1},"width":1,"height":1}));
        manager.addNewJoint(factory.pin({id:'3',"position":{"x":1,"y":1},bodyAId:'1',bodyBId:'2'}));
        manager.getWithId(1).update = function(){};
        manager.getWithId(2).update = function(){};
        manager.getWithId(3).update = function(){};
        var spy1 = sinon.spy(manager.getWithId(1),'update');
        var spy2 = sinon.spy(manager.getWithId(2),'update');
        var spy3 = sinon.spy(manager.getWithId(3),'update');
        manager.updateAll();
        expect(spy1.calledOnce).to.be.true;
        expect(spy2.calledOnce).to.be.true;
        expect(spy3.calledOnce).to.be.true;
    });
    it('Performs all actions',function(){
        initialize();
        manager.addNewEntity(factory.propulsor({id:'10',"angle":1,"position":{"x":1,"y":1},actionKeys:{"start":87}}));
        var callback = sinon.spy();
        manager.performAllActions(callback);
        expect(callback.calledWith(false)).to.be.true;
        manager.getWithId(10).startStopPropulsor(87,true);
        manager.performAllActions(callback);
        expect(callback.calledWith(true)).to.be.true;
    });
    xit('Get player heart',function(){})

});

