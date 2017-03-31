require('./common/Globals');
require('./common/Math');
var g_resources = require('./resource');
import {cc} from './constants.js';
import robotsVM from './client/Editor/Robots.js'
import DebugCanvas from './client/DebugCanvas.js'
class Game{
    constructor(gameLayer,cb){
        this.director = null;
        this.startGame(gameLayer,cb);

    }
    startGame(gameLayer,cb){
        if(!window.robotName) return;
        this.options = {
            robot:robotsVM.getRobot(window.robotName),
            //editorHtmlLayer:gameLayer.props.editorLayerCallbacks
        }
        const self = this;
        cc.game.onStart = function(){
            cb()
            RESOLUTION = {width:jQuery(cc._canvas.parentElement.parentElement).width(),height:jQuery(cc._canvas.parentElement.parentElement).height()}
            console.log(RESOLUTION);
            var Director = require('./client/GameDirector');
            var ConnectionManager = require('./client/ConnectionManager.js').default;
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
                self.director = new Director(MODE,connectionManager,self.options);
                cc.debugger_ = new DebugCanvas(cc._canvas);
                gameLayer.scene = self.director.getCurrentScene();
                //gameLayer.props.editorLayerCallbacks.ready(gameLayer.scene);
                //if(typeof  EditorTests !== undefined){
                //    window.tests = new EditorTests(director);
                //}
            }, gameLayer);
        };
        cc.game.run();
    }
    startSearchingOpponent(){
        if(this.director.getDirectorName() == 'EditorDirector')
            this.director.start('server',this.options);
        this.director.getCurrentScene().startSearchingOpponent();
    }
};
window.Game = Game;

