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
            scene = new EditorScene()
        }else{
            scene = new BattleScene();
            var socket = io.connect(xhost + ':' + xport);


            socket.on('connect',function() {
                console.log('Client has connected to the server!');
                connected = true;
            });

            socket.on('message', function(packet) {
                packet = JSON.parse(packet);

                if (packet && packet.m) {
                    switch(packet.m) {
                        case 'world-update':
                            scene.updateWorld(packet.d,packet.t);
                            break;
                        case 'world-start':
                            scene.startObjects(packet.d);
                            break;
                        case 'pong':
                            console.log('pong', new Date().getTime() - packet.d);
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