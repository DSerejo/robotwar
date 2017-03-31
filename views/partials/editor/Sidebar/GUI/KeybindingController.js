import React from 'react';
import keydown from 'react-keydown';
import keycodes from '../../../keycodes.js'
import {KeyCallbackComponent} from '../../helpers.js';
class KeybindingController extends KeyCallbackComponent{
    constructor(props){
        super(props);
        this.state = {value : props.value,editing:false}
    }
    handleClick(){
        this.setState({editing:true,value:-1});
        this.button.blur();
    }
    componentWillReceiveProps( nextProps ) {
        if(this.state.editing){
            const { keydown: { event } } = nextProps;
            if ( event ) {
                this.setState( {editing:false});
                this.props.onChange && this.props.onChange(event.which);
                cc._canvas.focus();
            }
        }else{
            const {value} = nextProps;
            this.setState( { value: value} );
        }
    }
    keyPressed(key){
        if(key == 84) { //t
            this.button.focus()
            this.handleClick()
        }
    }
    convertCodeToString(){
        return this.state.value>=0?keycodes[this.state.value]:'<_>';
    }
    render(){
        return <div>
            <span className="prop">{this.props.label || this.props.name}</span>
            <button className="value" ref={(c)=>this.button=c}onClick={this.handleClick.bind(this)}>{this.convertCodeToString()}</button>
            <div className="clearfix"></div>
        </div>;
    }
}
export default keydown(KeybindingController);