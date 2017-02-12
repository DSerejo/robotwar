import React from 'react';
import ReactDOM from 'react-dom';
import EditorLayer from './ElementInfo/InfoLayer.js'
import MenuLayer from './EditorMenuLayer/MenuLayer.js'
import HelperLayer from './Helper/HelperMenuLayer.js'
import GameLayer from '../gameLayer.js'
import keydown from 'react-keydown';
import {RegisterCallbacks} from './helpers.js';
import _ from 'lodash';
class Game extends React.Component{
    constructor(){
        super()
        this.state = {
            showEditorLayer:false,
            ready:false
        }
        this.configureKeypressCallbacks();

    }
    configureKeypressCallbacks(){
        this.registerCallbacks = new RegisterCallbacks();
    }
    setSelectedObject(element){
        if(element){
            this.setState({
                element:element,
                elementInfo:element.toObject(),
                showEditorLayer:true
            })
        }else{
            this.setState({
                element:element,
                elementInfo:{},
                showEditorLayer:false
            })
        }
    }
    editorLayerCallbacks(){
        var self = this;
        return {
            setSelectedObject:this.setSelectedObject.bind(this),
            ready:this.ready.bind(this),
            keyPressed:(key)=>self.registerCallbacks.triggerEvent('keyPressed',[key]),
            keyReleased:(key)=>self.registerCallbacks.triggerEvent('keyReleased',[key])
        }
    }
    ready(editorScene){
        this.editorScene = editorScene;
        this.setState({ready:true});
    }
    shouldShowMenuLayer(){
        return !this.state.showEditorLayer && this.state.ready;
    }
    render(){
        var registerKeyCallBacks = {
            pressed: this.registerCallbacks.registerCallback.bind(this.registerCallbacks, 'keyPressed'),
            released: this.registerCallbacks.registerCallback.bind(this.registerCallbacks, 'keyReleased')
        };
        return <div>
            <GameLayer editorLayerCallbacks={this.editorLayerCallbacks()} />
            <EditorLayer show={this.state.showEditorLayer} editorScene={this.editorScene} element={this.state.element} editorLayerCallbacks={this.editorLayerCallbacks()} registerKeyCallBacks={registerKeyCallBacks} />
            <MenuLayer show={this.shouldShowMenuLayer()} editorScene={this.editorScene} registerKeyCallBacks={registerKeyCallBacks}/>
            <HelperLayer registerKeyCallBacks={registerKeyCallBacks}/>
        </div>
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);