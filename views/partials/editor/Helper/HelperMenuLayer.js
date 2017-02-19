import React from 'react';
import classNames from 'classnames';
import keydown from 'react-keydown';
import {calculateLayerStylesheet,KeyCallbackComponent} from '../helpers.js';
class HelperRow extends React.Component{
    render(){
        return <div>
            <b>{this.props.command}: </b>
            <span>{this.props.description}</span>
        </div>
    }
}
class HelperLayer extends KeyCallbackComponent{
    constructor(props){
        super(props)
        this.state = {show:false}
    }
    keyPressed(key){
        if(key==72){
            this.setState({show:!this.state.show});
        }
    }
    render(){
        var helperBoxClassName = classNames({
                hide:!this.state.show,
                helper:true
        });
        var helperTextClassName = classNames({
                hide:this.state.show,
                'helper-text':true
            });
        return <div className="editor-box" style={calculateLayerStylesheet()}>
            <div className={helperTextClassName}>
                Press H for help
            </div>
            <div className={helperBoxClassName}>
                <HelperRow command="Ctrl + click" description="Select next nested object" />
                <HelperRow command="< >" description="Select next/prev object" />
                <HelperRow command="A S D W" description="Move selected element" />
                <HelperRow command="Q E" description="Rotate selected element" />
                <HelperRow command="Shift + Movement key" description="Higher precision" />
                <HelperRow command="Delete" description="Remove selected object" />
                <HelperRow command="Ctrl + z" description="Undo" />
                <HelperRow command="Ctrl + Shift + z" description="Redo" />
            </div>
        </div>
    }
}

export default HelperLayer;
