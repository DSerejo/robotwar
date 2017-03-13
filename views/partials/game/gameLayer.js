import React from 'react';
require('../../../testhelpers');
import robotsVM from '../editor/Robots.js'
class GameLayer extends React.Component{
    constructor(props){
        super(props);
        this.started = false;
        this.init();

    }
    init(){
        if(!window.robotName) return;
        const cc = window.cc,
            self = this;
        cc.game.onStart = function(){
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
                if(typeof  EditorTests !== undefined){
                    window.tests = new EditorTests(director);
                }
            }, this);

        };
        cc.game.run();
        this.started = true
    }
    componentWillReceiveProps(nextProps){
        const {location} = nextProps,
            nextRobot = location.query.robot,
            currentRobot = this.props.location.query.robot;
        if(nextRobot && nextRobot != currentRobot){
            const robotJson = localStorage['robot_'+nextRobot];
            if(robotJson){
                robotsVM.setCurrentRobotName(nextRobot);
                const robot = JSON.parse(robotJson);
                if(this.scene)
                    this.scene.restartWith(robot);
                else if(!this.started)
                    this.init();
            }
        }
    }
    render(){
        return <canvas id="gameCanvas" width="321" height="480"></canvas>
    }
}
module.exports = GameLayer