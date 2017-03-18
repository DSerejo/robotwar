
describe('Box',function(){
    importBox2d();
    var world,box;
    var Box = require(testDir(__dirname) + '/Box');
    var Materials = require(testDir(__dirname) + '/../Physics/Materials');
    world = new b2World(gravity);

    it('Creates a box',function(){
        var box = new Box(1,1,1,{x:1,y:1},0,Materials.wood(),null,world);
        expect(box.type).to.equal('box');
    });

});

