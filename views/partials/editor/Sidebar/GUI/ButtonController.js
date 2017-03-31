'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import ShortcutListener from './ShortcutListener.js';
class ButtonController extends ShortcutListener{
	constructor(props){
		super(props);
		this.prepareKeyCallbacks();

	}
	handleClick(){
		this.props.action && this.props.action();
	}
	shortCutPressed(){
		this.handleClick();
	}
    render(){
    	
        return <div onClick={this.handleClick.bind(this)}>
          {this.props.name}
       </div>;
    }
} 
export default ButtonController;