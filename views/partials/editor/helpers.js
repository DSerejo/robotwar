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
        this.callbackPriorities = {};
    }
    registerCallback(event,callback,priority){
        priority = priority || 0;
        this.callbacks[event] = this.callbacks[event] || {};
        this.callbackPriorities[event] = this.callbackPriorities[event] || [];
        const id = this.lastId++;
        this.callbacks[event][id] = callback;
        this.callbackPriorities[event].push({id:id,priority:priority});
        return ()=>{
            this.callbackPriorities[event].splice(_.findIndex(this.callbackPriorities,{id:id}),1);
            delete this.callbacks[event][id]
        };
    }
    triggerEvent(event,a){
        const ordered = _.orderBy(this.callbackPriorities[event],['priority'],['desc'])
        var stop = false;
        let args = [].concat(a);
        args.push(()=>{stop = true;})
        _.each(ordered,(c)=>{
            const fn = this.callbacks[event][c.id];
            if(fn && !stop && fn.apply)
                fn.apply(null,args);
            return !stop;
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
        if(this.registered) return;
        this.unregisterKeypressed = registerKeyCallBacks.pressed(this.keyPressed.bind(this),this.priority);
        this.unregisterKeyreleased = registerKeyCallBacks.released(this.keyReleased.bind(this),this.priority);
        this.registered = true;
    }
    componentWillMount(){
        if(!this.delayCallbackRegistration)
            this.registerKeyCallbacks();
    }
    componentWillUnmount(){
        this.unregisterKeypressed && this.unregisterKeypressed();
        this.unregisterKeyreleased && this.unregisterKeyreleased();
        this.registered = false;;
    }
    keyReleased(key){}
    keyPressed(key){}
}

export {calculateLayerStylesheet,registerKeyCallBacks,registerCallbacks,KeyCallbackComponent};