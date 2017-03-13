var DirectorBase = cc.Class.extend({
    runScene:function(){
        cc.director.runScene(this.currentScene);
        cc.debugger_ = new DebugCanvas(cc._canvas,this.currentScene);
    }
});
var Director = cc.Class.extend({
    connectionManager:null,
    mode:null,
    ctor:function(mode,connectionManager,extraOptions){
        this.mode = mode;
        this.connectionManager = connectionManager;
        this.start(extraOptions)
    },
    start:function(extraOptions){
        if(MODE != 'server'){
            this.director = new EditorDirector(extraOptions);
        }else{
            this.director = new BattleDirector(this.connectionManager,extraOptions);
        }

    },
    getCurrentScene(){
        return this.director.currentScene;
    }
});