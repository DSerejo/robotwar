class AddNewObjectTest{
    constructor(){
        this.layer = null
    }
    run(scene,options){
        addBox(scene,function(){
            addPropulsor(scene,function(){
                addPin(scene,function(){
                    addBox(scene,function(){

                        },
                    [{_x:200,_y:200},{_x:201,_y:201},{_x:201,_y:201}]);
                });
            });
        });

    }

}
function addBox(scene,done,events){
    scene.addNewObject('box');
    events = events || [];
    console.assert(scene.newObjectLayer!=null,'newObjectLayer should not be null');
    var layer = scene.newObjectLayer;
    var startEvent=events[0] || {_x:300,_y:300}
        ,event1 = events[1] || {_x:350,_y:350},
        event2 = events[2] || {_x:400,_y:350};

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
        expect(obj.w).to.equal(Math.max(cc.convertPixelToMeter(event2._x -startEvent._x),window.MIN_SIZE));
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
        expect(obj.sprite.getContentSize().width).to.equal(8);
        done && done()
    }
}
export default AddNewObjectTest;

