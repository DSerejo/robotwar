'use strict';
import {Director} from './Director.js';
import {EditorDirector} from './Battle/BattleDirector.js';
import {BattleDirector} from './Editor/EditorDirector.js';
class GameDirector extends Director{
    constructor(mode,connectionManager,extraOptions){
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
export default GameDirector;