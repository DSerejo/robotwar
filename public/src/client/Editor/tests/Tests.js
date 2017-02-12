var EditorTests = cc.Class.extend({
    scene:null,
    tests:{},
    ctor:function(scene){
        this.scene=scene;
        this.setTests();
    },
    setTests:function(){
        this.tests ={
            'addNewObject': new AddNewObject()
        }
    },
    runTests:function(except){
        var self = this;
        _.each(this.tests,function(test,testName){
            if(except.indexOf(testName)>=0) return;
            test.run(self.scene);
        });
    },
    runTest:function(test,options){
        this.tests[test] && this.tests[test](this.scene.options);
    }
});


