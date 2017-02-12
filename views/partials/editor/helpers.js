import jQuery from 'jquery';
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
            fn.apply(null,a);
        })
    }
}

export {calculateLayerStylesheet,RegisterCallbacks};