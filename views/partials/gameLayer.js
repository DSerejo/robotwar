import React from 'react';
require('../../testhelpers');
class GameLayer extends React.Component{
    constructor(props){
        super(props);
        this.init();
    }
    init(){
        const cc = window.cc,
            self = this

        cc.game.onStart = function(){
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
                var scene;
                if(MODE != 'server'){
                    scene = new EditorScene();
                    scene.editorHtmlLayer = self.props.editorLayerCallbacks;
                    self.props.editorLayerCallbacks.ready(scene);
                    if(typeof  EditorTests !== undefined){
                        window.tests = new EditorTests(scene);
                    }
                }else{
                    scene = new BattleScene();
                    var socket = io.connect(xhost + xport);
                    scene.socket = socket;


                    socket.on('connect',function() {
                        console.log('Client has connected to the server!');
                        connected = true;
                    });
                    setInterval(function(){
                        socket.emit('message',{m:'ping',d:new Date().getTime()});
                    },1000)
                    socket.emit('message',{m:'ping',d:new Date().getTime()});
                    socket.on('message', function(packet) {
                        packet = JSON.parse(packet);

                        if (packet && packet.m) {
                            switch(packet.m) {
                                case 'world-update':
                                    //console.log(new Date().getTime() - packet.t);
                                    scene.updateWorld(packet.d,packet.t);
                                    break;
                                case 'world-start':
                                    scene.startObjects(packet.d);
                                    break;
                                case 'pong':
                                    var dt = new Date().getTime() - packet.d;
                                    window.diffTimestamp = packet.t - packet.d - dt/2;
                                    break;
                                default:
                                    break;
                            }

                        }
                    });

                    socket.on('disconnect',function() {
                        console.log('The client has disconnected!');
                        connected = false;
                    });
                }




                cc.director.runScene(scene);
                cc.debugger_ = new DebugCanvas(cc._canvas,scene);
            }, this);

        };
        cc.game.run();
    }
    render(){
        return <canvas id="gameCanvas" width="321" height="480"></canvas>
    }
}
module.exports = GameLayer