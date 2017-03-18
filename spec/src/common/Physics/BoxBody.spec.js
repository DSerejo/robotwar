var BoxBody = require(testDir(__dirname) + '/BoxBody');
describe('BoxBody',function(){
    var world;
    importBox2d();
    world = new b2World(gravity);
    it('creates a box body',function(){
        var boxBody = new BoxBody(1,1,0,1,1,1,{x:0,y:0},0,{},world);
        expect(boxBody.body.constructor.name).to.equal('b2Body');

    })
});
