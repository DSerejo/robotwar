import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import {KeyCallbackComponent} from '../helpers.js';
import {Folder,ButtonController,EntityController,SelectedElementController,StaticController,ControllerFactory,ComponentList} from './GUI';


class ElementsMapper {
    static map(scene,running){
        const manager = scene.getEntityManager();
        if(!manager) return
        const controller = {
                Selected:{selectedElement:true,scene:scene,hide:running},
                "Elements":{
                    controllers:{
                        
                        Bodies:{folder:true,shortCut:{key:66,priority:1},controllers:ElementsMapper.mapBodies(manager,scene)},
                        Joints:{folder:true,shortCut:{key:74,priority:1},controllers:ElementsMapper.mapJoints(manager,scene)},

                    },
                    hide:running,
                    shortCut:{key:76,priority:1},//l
                    folder:true
                }
            }
        return controller;
    }
    static mapJoints(manager,scene){
        var controllers = {};
        _.each(manager.joints,(j,id)=>{
            controllers[id] =  {manager:manager,scene:scene,entity:true};;
        })
        return controllers;
    }
    static mapBodies(manager,scene){
        var controllers = {};
        _.each(manager.entities,(b,id)=>{
            controllers[id] = {manager:manager,scene:scene,entity:true};
        })
        return controllers;
    }
}

class EditorSidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            running:false
        }
    }
    componentWillReceiveProps(nextProps){
        nextProps.editorScene && nextProps.editorScene.event.on('start',this.forceUpdate.bind(this));
    }
    toggleRunningState(){
        if(this.state.running)
            this.props.editorScene.worldLayer.restart();
        else
            this.props.editorScene.worldLayer.run();
        this.setState({running:!this.state.running});
    }
    toggleDebugLayer(){
        window.cc.debugger_.toggle()
    }
    save(){
        this.props.editorScene.worldLayer.save();
    }
    mapGui(){
        this.controllers = [];
        let gui = {},
            elements = this.getElements(),
            buttons = this.actionButtons(),
            add_elements = this.getAddElements();

        if(this.props.editorScene)
            gui = _.extend({},add_elements,elements,buttons)

        _.each(gui,(control,id)=>{
            this.addControl(id,control);
        })
    }
    getAddElements(){
        return !this.props.editorScene?{}:{'Add element':{compList:true,scene:this.props.editorScene,hide:this.state.running}}
    }
    getElements(){
        return !this.props.editorScene?{}:ElementsMapper.map(this.props.editorScene,this.state.running)
    }
    actionButtons(){
        return {
                "Save":{button:true,action:this.save.bind(this),hide:this.state.running},
                "Run":{label:this.state.running?"Restart":"Test Robot",button:true,action:this.toggleRunningState.bind(this),shortCut:{key:82}},
                "Debug":{button:true,action:this.toggleDebugLayer.bind(this)}
            }
    }
    addControl(name,control){
        const controller = ControllerFactory.createController(name,control);
        const classnames = classNames({
            ["controller_"+controller.type]:true,
            hide:control.hide
        })
        this.controllers.push(<li key={name} className={classnames}>
            {controller.controller}
        </li>);
    }

    render(){
        this.mapGui();
        console.log(this.controllers);
        return <ul className="sidebar">{this.controllers}</ul>;
    }
}
export {EditorSidebar,Folder,ControllerFactory}

