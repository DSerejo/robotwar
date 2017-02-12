import React from 'react';
import classNames from 'classnames';
import keydown from 'react-keydown';
import {calculateLayerStylesheet} from '../helpers.js';
class HelperRow extends React.Component{
    render(){
        return <div>
            <b>{this.props.command}: </b>
            <span>{this.props.description}</span>
        </div>
    }
}
class HelperLayer extends React.Component{
    constructor(props){
        super(props)
        this.state = {show:false}
        this.props.registerKeyCallBacks.pressed(this.keyPressed.bind(this))
    }
    keyPressed(key){
        if(key==72){
            this.setState({show:!this.state.show});
        }
    }
    render(){
        var className = classNames({
            hide:!this.state.show,
            'editor-box':true

        });
        return <div className={className} style={calculateLayerStylesheet()}>
            <div className="helper">
                <HelperRow command="Ctrl + click" description="Select next nested object" />
                <HelperRow command="< >" description="Select next/prev object" />
                <HelperRow command="A S D W" description="Move selected elemen't" />
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
