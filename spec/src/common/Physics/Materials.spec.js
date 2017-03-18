var Materials = require(testDir(__dirname) + '/Materials');

describe('Materials',function(){
    it('Creates wood',function(){
        var material = Materials.wood();
        expect(material.name).to.equal('wood');
    });
    it('Creates metal',function(){
        var material = Materials.metal();
        expect(material.name).to.equal('metal');
    });
    it('Creates rubber',function(){
        var material = Materials.rubber();
        expect(material.name).to.equal('rubber');
    });
    it('Creates ground',function(){
        var material = Materials.ground();
        expect(material.name).to.equal('ground');
    });

});

