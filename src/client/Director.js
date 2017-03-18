'use strict';
import {cc} from '../constants.js';
class Director{
    runScene(){
        cc.director.runScene(this.currentScene);
        //cc.debugger_ = new DebugCanvas(cc._canvas,this.currentScene);
    }
}
module.exports = Director;