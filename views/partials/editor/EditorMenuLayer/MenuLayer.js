import React from 'react';
import classNames from 'classnames';
import ComponentList from './ComponentList.js';
import {calculateLayerStylesheet} from '../helpers.js';
var KeyPressed = {
    shiftPressed:false,
    ctrlPressed:false
};
class MenuLayer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showList:false,
            running:false
        }
    }
    registerKeyCallbacks(){
        this.unregisterKeypressed = this.props.registerKeyCallBacks.pressed(this.keyPressed.bind(this));
        this.unregisterKeyreleased = this.props.registerKeyCallBacks.released(this.keyReleased.bind(this));
    }
    componentWillMount(){
        this.registerKeyCallbacks();
    }
    componentWillUnmount(){
        this.unregisterKeypressed && this.unregisterKeypressed();
        this.unregisterKeyreleased && this.unregisterKeyreleased();
    }
    toggleComponentList(){
        this.setState({showList:!this.state.showList});
    }
    toggleRunningState(){
        if(this.state.running)
            this.props.editorScene.worldLayer.restart();
        else
            this.props.editorScene.worldLayer.run();
        this.setState({running:!this.state.running});
    }
    save(){
        this.props.editorScene.worldLayer.save();
    }
    componentCallback(){
        this.toggleComponentList();
    }
    keyReleased(key){
        switch (key){
            case 16: //shift
                KeyPressed.shiftPressed = false;
                break;
            case 17: //ctrl
                KeyPressed.ctrlPressed = false;
                break;
        }
    }
    keyPressed(key){
        switch (key){
            case 90: //z
                if(KeyPressed.ctrlPressed){
                    if(KeyPressed.shiftPressed){
                        this.props.editorScene.worldLayer.redo();
                    }else{
                        this.props.editorScene.worldLayer.undo();
                    }
                }
                break;
            case 16: //shift
                KeyPressed.shiftPressed = true;
                break;
            case 17: //ctrl
                KeyPressed.ctrlPressed = true;
                break;
            default:
                break;
        }
    }

    render(){
        var className = classNames({
            hide:!this.props.show,
            'editor-box':true
        });
        var runBtnText = this.state.running?'Restart':"Run";
        var addComponentBtn = this.state.running?null:<button id="add-component" onClick={this.toggleComponentList.bind(this)}>Add component</button>;
        return <div className={className} style={calculateLayerStylesheet()}>
            {addComponentBtn}
            <button id="run" onClick={this.toggleRunningState.bind(this)}>{runBtnText}</button>
            <button id="save" onClick={this.save.bind(this)}>Save</button>
            <ComponentList show={this.state.showList} onChange={this.componentCallback.bind(this)} editorScene={this.props.editorScene}/>
        </div>
    }
}

export default  MenuLayer;
