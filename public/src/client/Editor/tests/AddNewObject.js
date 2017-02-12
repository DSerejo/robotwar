var AddNewObject = cc.Class.extend({
    layer:null,
    run:function(scene,options){
        addBox(scene,function(){
            addPropulsor(scene,function(){
                addPin(scene);
            });
        });

    }

});
function addBox(scene,done){
    scene.addNewObject('box');
    console.assert(scene.newObjectLayer!=null,'newObjectLayer should not be null');
    var layer = scene.newObjectLayer;
    var startEvent={_x:300,_y:300}
        ,event1 = {_x:350,_y:350},
        event2 = {_x:400,_y:350};
    mouseDown(startEvent);
    mouseMove(event1);
    setTimeout(function(){
        mouseMove(event2);
        mouseUp();
    },500)


    function mouseDown(startEvent){
        layer.onMouseDown(startEvent);
        console.assert(layer.startedPoint.x==cc.convertPixelToMeter(startEvent._x),'Started point should be the same as event');
    }
    function mouseMove(event){
        layer.onMouseMove(event);
        console.assert(layer.objectToBeAdded != null,'Object');
    }
    function mouseUp(){
        layer.onMouseUp();
        expect(scene.newObjectLayer).to.be.null;
        var obj = EntityManager.entities[EntityManager.lastID];
        expect(obj.w).to.equal(cc.convertPixelToMeter(event2._x -startEvent._x));
        done && done()
    }

}
function addPropulsor(scene,done){
    scene.addNewObject('propulsor');
    console.assert(scene.newObjectLayer!=null,'newObjectLayer should not be null');
    var layer = scene.newObjectLayer;
    var startEvent={_x:300,_y:300}
    mouseDown(startEvent);
    function mouseDown(startEvent){
        layer.onMouseDown(startEvent);
        console.assert(layer.startedPoint.x==cc.convertPixelToMeter(startEvent._x),'Started point should be the same as event');
        expect(scene.newObjectLayer).to.be.null;
        var obj = EntityManager.entities[EntityManager.lastID];
        expect(obj.w).to.equal(0.75);
        done && done()
    }
}
function addPin(scene,done){
    scene.addNewObject('pin');
    console.assert(scene.newObjectLayer!=null,'newObjectLayer should not be null');
    var layer = scene.newObjectLayer;
    var startEvent={_x:300,_y:300}
    mouseDown(startEvent);
    function mouseDown(startEvent){
        layer.onMouseDown(startEvent);
        console.assert(layer.startedPoint.x==cc.convertPixelToMeter(startEvent._x),'Started point should be the same as event');
        expect(scene.newObjectLayer).to.be.null;
        var obj = EntityManager.joints[EntityManager.lastID];
        expect(obj.sprite.getContentSize().width).to.equal(0.25);
        done && done()
    }
}
