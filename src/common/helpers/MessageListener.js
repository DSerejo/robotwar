import {Mixin} from ".../../../tools/mixwith/mixwith.js";
const MessageListenerMixin = Mixin((sup) => {
	class MessageListener extends sup{
		onMessage(packet){
			const ctor = this.constructor.name;
	        if (packet && packet.m && this[this.acceptableMessages[packet.m]])
	        	this[this.acceptableMessages[packet.m]](packet);
	    }

	}
	MessageListener.prototype.acceptableMessages = {};
	return MessageListener;
});

export {MessageListenerMixin};