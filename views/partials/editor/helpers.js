import jQuery from 'jquery';
import React from 'react';
const $ = jQuery;

function calculateLayerStylesheet(){
    var gameCanvas = document.getElementById('gameCanvas');
    if(!gameCanvas) return {};
    return {
        width:gameCanvas.style.width,
        height:gameCanvas.style.height,
        margin:$('#Cocos2dGameContainer').css('margin')
    }
}

class RegisterCallbacks{
    constructor(){
        this.lastId = 0;
        this.callbacks = {};
    }
    registerCallback(event,callback){
        this.callbacks[event] = this.callbacks[event] || {};
        const id = this.lastId++;
        this.callbacks[event][id] = callback;
        return ()=>delete this.callbacks[event][id];
    }
    triggerEvent(event,a){
        _.each(this.callbacks[event],function(fn){
            if(fn && fn.apply)
                fn.apply(null,a);
        })
    }
}
var registerCallbacks = new RegisterCallbacks();
var registerKeyCallBacks = {
    pressed: registerCallbacks.registerCallback.bind(registerCallbacks, 'keyPressed'),
    released: registerCallbacks.registerCallback.bind(registerCallbacks, 'keyReleased')
};
class KeyCallbackComponent extends React.Component{
    registerKeyCallbacks(){
        this.unregisterKeypressed = registerKeyCallBacks.pressed(this.keyPressed.bind(this));
        this.unregisterKeyreleased = registerKeyCallBacks.released(this.keyReleased.bind(this));
    }
    componentWillMount(){
        this.registerKeyCallbacks();
    }
    componentWillUnmount(){
        this.unregisterKeypressed && this.unregisterKeypressed();
        this.unregisterKeyreleased && this.unregisterKeyreleased();
    }
    keyReleased(key){}
    keyPressed(key){}
}

export {calculateLayerStylesheet,registerKeyCallBacks,registerCallbacks,KeyCallbackComponent};