var EditorTests = cc.Class.extend({
    director:null,
    scene:null,
    tests:{},
    ctor:function(director){
        this.director=director;
        this.setTests();
    },
    updateCurrentScene:function(){
        this.scene = this.getCurrentScene();
    },
    setTests:function(){
        this.tests ={
            'addNewObject': new AddNewObjectTest()
        }
    },
    runTests:function(except){
        this.updateCurrentScene()
        var self = this;
        _.each(this.tests,function(test,testName){
            if(except.indexOf(testName)>=0) return;
            test.run(self.scene);
        });
    },
    runTest:function(test,options){
        this.updateCurrentScene()
        this.tests[test] && this.tests[test].run(this.scene,options);
    }
});


