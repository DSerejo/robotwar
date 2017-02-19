import React from 'react';
import classNames from 'classnames';
import ComponentList from './ComponentList.js';
import ElementList from './ElementList.js';
import {calculateLayerStylesheet,KeyCallbackComponent} from '../helpers.js';
var KeyPressed = {
    shiftPressed:false,
    ctrlPressed:false
};
class MenuLayer extends KeyCallbackComponent{
    constructor(props){
        super(props);
        this.state = {
            showList:false,
            running:false,
            showElementList:false
        }
    }
    toggleComponentList(){
        this.setState({showList:!this.state.showList});
    }
    toggleElementList(){
        this.setState({showElementList:!this.state.showElementList});
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
            case 65: //a
                if(!this.props.show || this.state.running) return;
                this.toggleComponentList();
                break;
            case 76: //l
                if(!this.props.show || this.state.running) return;
                this.toggleElementList();
                break;
            case 82: //r
                if(!this.props.show) return;
                this.toggleRunningState();
                break;
            case 83: //s
                if(!this.props.show || !KeyPressed.ctrlPressed || this.state.running) return;
                this.save();
                break;
            case 90: //z
                if(!this.props.show || this.state.running) return;
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
    toggleDebugLayer(){
        window.cc.debugger_.toggle()
    }
    render(){
        var className = classNames({
            hide:!this.props.show,
            'editor-box':true
        });
        var runBtnText = this.state.running?'Restart':"Run";
        var hideIfRunning = this.state.running?'hide':'';
        return <div className={className} style={calculateLayerStylesheet()}>
            <button id="add-component" className={hideIfRunning} onClick={this.toggleComponentList.bind(this)}>Add component</button>
            <button id="list-elements" className={hideIfRunning} onClick={this.toggleElementList.bind(this)}>Element list</button>
            <button id="run" onClick={this.toggleRunningState.bind(this)}>{runBtnText}</button>
            <button id="save" className={hideIfRunning} onClick={this.save.bind(this)}>Save</button>
            <button id="debug"  onClick={this.toggleDebugLayer.bind(this)}>Debug</button>
            <ComponentList show={this.state.showList}
                           onChange={this.componentCallback.bind(this)}
                           editorScene={this.props.editorScene}/>
            <ElementList show={this.state.showElementList && !this.state.running}
                           editorScene={this.props.editorScene}/>
        </div>
    }
}

export default  MenuLayer;
