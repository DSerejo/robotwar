import React from 'react';
import ReactDOM from 'react-dom';
import EditorLayer from './ElementInfo/InfoLayer.js'
import MenuLayer from './EditorMenuLayer/MenuLayer.js'
import HelperLayer from './Helper/HelperMenuLayer.js'
import GameLayer from '../game/gameLayer.js'
import Sidebar from './Sidebar/Sidebar.js'
import { Router, Route,browserHistory } from 'react-router'
import keydown from 'react-keydown';
import robotsVM from './Robots.js';
import {registerCallbacks} from './helpers.js';
import _ from 'lodash';
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showEditorLayer:false,
            ready:false
        }
        robotsVM.start(this.props.location);
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
            keyPressed:(key)=>registerCallbacks.triggerEvent('keyPressed',[key]),
            keyReleased:(key)=>registerCallbacks.triggerEvent('keyReleased',[key])
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

        return <div className="container">
            <div className="row">
                <div className="col-sm-3">
                    <Sidebar editorLayerCallbacks={this.editorLayerCallbacks()} location={this.props.location} />
                </div>
                <div className="col-sm-9">
                    <GameLayer editorLayerCallbacks={this.editorLayerCallbacks()} location={this.props.location}/>
                    <EditorLayer show={this.state.showEditorLayer} editorScene={this.editorScene} element={this.state.element} editorLayerCallbacks={this.editorLayerCallbacks()} />
                    <MenuLayer show={this.shouldShowMenuLayer()} editorScene={this.editorScene} />
                    <HelperLayer />
                </div>
            </div>
        </div>
    }
}
class NoMatch extends React.Component{
    render(){
        return <div>Page not found</div>
    }
}
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Game}>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>,
    document.getElementById('root')
);