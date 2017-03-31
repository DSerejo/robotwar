'use strict;'
import React from 'react'
import {KeyCallbackComponent} from '../../helpers.js';

class ShortcutListener extends KeyCallbackComponent{
    prepareKeyCallbacks(){
        if(this.props.shortCut){
            this.priority = this.props.shortCut.priority;
        }
        
        
    }
    componentWillMount(){
    	if(this.props.shortCut)
			super.componentWillMount()
    }
    keyPressed(key,stopPropagation){
        switch (key){
            case this.props.shortCut.key:
                this.shortCutPressed();
                stopPropagation();
                break;
        }
    }
    shortCutPressed(){}
}
export default ShortcutListener;