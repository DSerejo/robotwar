'use strict';
var AddNewObjectTest = require('./AddNewObject');
class EditorTests   {
    ctor(director){
        this.scene = null
        this.director=director;
        this.setTests();
    }
    updateCurrentScene(){
        this.scene = this.getCurrentScene();
    }
    setTests(){
        this.tests ={
            'addNewObject': new AddNewObjectTest()
        }
    }
    runTests(except){
        this.updateCurrentScene()
        var self = this;
        _.each(this.tests,function(test,testName){
            if(except.indexOf(testName)>=0) return;
            test.run(self.scene);
        });
    }
    runTest(test,options){
        this.updateCurrentScene()
        this.tests[test] && this.tests[test].run(this.scene,options);
    }
}

export default EditorTests;
