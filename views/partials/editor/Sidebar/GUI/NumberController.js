'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import {KeyCallbackComponent} from '../../helpers.js';
import {cc} from '../../../../../src/constants.js'
class NumberController extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			value: Math.round_decimal(this.props.value),
			name: this.props.label || this.props.prop
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({value:Math.round_decimal(nextProps.value)})
	}
	handleChange(event){
		this.setState({value: event.target.value});
	}
	handleKeyDown(event){
		if(event.key == "Enter"){
			cc._canvas.focus();
		}
		if(event.keyCode == 27){ //ESC
			this.revertChanges();
			cc._canvas.focus();
		}
	}
	handleBlur(){
		this.checkAndApplyChanges();
	}
	checkAndApplyChanges(){
		const v = Math.round_decimal(this.state.value)
		if(_.isNaN(v) || v == 0)
			return this.revertChanges();
		if(Math.round_decimal(this.props.value) != v){
			this.props.onChange && this.props.onChange(v);
		}
	}
	revertChanges(){
		this.setState({value:Math.round_decimal(this.props.value)})
	}
    render(){
    	return <div>
          <span className="prop">{this.state.name}</span>
          <input className="value" type="text" onChange={this.handleChange.bind(this)} value={this.state.value} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)}/> 
          <div className="clearfix"></div>
       </div>;
    }
}
export default NumberController;