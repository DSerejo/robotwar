'use strict';
import Director from './Director.js';
import BattleDirector from './Battle/BattleDirector.js';
import EditorDirector from './Editor/EditorDirector.js';
class GameDirector extends Director{
    constructor(mode,connectionManager,extraOptions){
        super();
        this.connectionManager = connectionManager;
        this.start(mode,extraOptions)
    }
    start(mode,extraOptions){
        this.mode = mode;
        MODE = mode;
        if(mode != 'server'){
            this.director = new EditorDirector(extraOptions);
        }else{
            this.director = new BattleDirector(this.connectionManager,extraOptions);
        }

    }
    /**
     * @return {cc.Scene}
     */
    getCurrentScene(){
        return this.director.currentScene;
    }
    getDirectorName(){
        return this.director.constructor.name;
    }
}
module.exports = GameDirector;