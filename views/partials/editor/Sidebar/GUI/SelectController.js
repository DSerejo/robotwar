'use strict;'
import React from 'react'
import Select from 'react-select';

class SelectController extends React.Component{
	constructor(props){
		super(props);
		this.state = {value:this.props.value}	
	}
	handleChange(v){
		this.setState({value:v})
		this.props.onChange && this.props.onChange(v.value);
	}
	
    render(){
    	return <div>
          <span className="prop">{this.props.prop}</span>
          <Select className="value" value={this.state.value} onChange={this.handleChange.bind(this)} multi={false} options={this.props.options}/> 
          <div className="clearfix"></div>
       </div>;
    }
}
export default SelectController;