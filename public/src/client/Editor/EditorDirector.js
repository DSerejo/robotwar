var EditorDirector = DirectorBase.extend({
    currentScene:null,
    ctor:function(extraOptions){
        this.currentScene =  new EditorScene();
        this.addExtraSceneOptions(extraOptions);
        this.runScene();
    },
    addExtraSceneOptions:function(extraOptions){
        var self = this;
        _.each(extraOptions,function(value,key){
            self.currentScene[key] = value;
        })
    }

});