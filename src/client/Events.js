"use strict";
const EventListenerMixin = (sup)=> class extends sup{
    startListening(events){
        var self = this;
        events.forEach(function(event){
            const eventHandlerName = 'on'+event.capitalizeFirstLetter()
            if(self[eventHandlerName]){
                document.addEventListener(event, self[eventHandlerName].bind(self), false);
            }
        })
        
    }
}
const EventListener = EventListenerMixin(sup);
class EventDispatcher{}
EventDispatcher.dispatchEvent = function(event,data={},caller=null,elem=document){
	data.caller = caller;
	elem.dispatchEvent(new CustomEvent(event,{'detail':data}));
}
export default EventDispatcher
export {EventListener,EventListenerMixin}