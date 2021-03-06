'use strict';
import EditorScene from './EditorScene.js';
import Director from '../Director.js';
class EditorDirector extends Director{

    constructor(extraOptions){
        super()
        this.currentScene =  new EditorScene();
        this.addExtraSceneOptions(extraOptions);
        this.runScene();
    }
    addExtraSceneOptions(extraOptions){
        var self = this;
        _.each(extraOptions,function(value,key){
            self.currentScene[key] = value;
        })
    }

}
module.exports = EditorDirector;