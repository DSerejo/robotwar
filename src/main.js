require('./common/Globals');
require('./common/Math');
var g_resources = require('./resource');
import {cc} from './constants.js';
import robotsVM from './client/Editor/Robots.js'

window.GameLoader = function(gameLayer){
    if(!window.robotName) return;
    const self = gameLayer;
    cc.game.onStart = function(){
        var Director = require('./client/GameDirector');
        var ConnectionManager = require('./client/ConnectionManager.js');
        var EditorTests = require('./client/Editor/tests/Tests');
        cc._canvas.focus();
        if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
            document.body.removeChild(document.getElementById("cocosLoading"));

        var designSize = RESOLUTION;
        var screenSize = cc.view.getFrameSize();

        if(!cc.sys.isNative && screenSize.height < 800){
            designSize = RESOLUTION;
            cc.loader.resPath = "res/Normal";
        }else{
            cc.loader.resPath = "res/HD";
        }
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            var connectionManager = new ConnectionManager();
            var director = new Director(MODE,connectionManager,{
                robot:robotsVM.getRobot(window.robotName),
                editorHtmlLayer:self.props.editorLayerCallbacks
            });
            self.scene = director.getCurrentScene();
            self.props.editorLayerCallbacks.ready(self.scene);
            //if(typeof  EditorTests !== undefined){
            //    window.tests = new EditorTests(director);
            //}
        }, gameLayer);

    };
    cc.game.run();
};