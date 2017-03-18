'use strict';
import Director from './Director.js';
import BattleDirector from './Battle/BattleDirector.js';
import EditorDirector from './Editor/EditorDirector.js';
class GameDirector extends Director{
    constructor(mode,connectionManager,extraOptions){
        super();
        this.mode = mode;
        this.connectionManager = connectionManager;
        this.start(extraOptions)
    }
    start(extraOptions){
        if(MODE != 'server'){
            this.director = new EditorDirector(extraOptions);
        }else{
            this.director = new BattleDirector(this.connectionManager,extraOptions);
        }

    }
    getCurrentScene(){
        return this.director.currentScene;
    }
}
module.exports = GameDirector;