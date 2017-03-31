'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import {KeyCallbackComponent} from '../../helpers.js';
import Folder from './Folder'
import toastr from 'toastr';
class EntityController extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
        this.updateElement(props);
    }
    updateElement(nextProps){
        this.stopListening()
        if(nextProps.entityId && nextProps.manager){
            this.entity = nextProps.manager.getWithId(nextProps.entityId);
            this.startListening();    
        }
    }
    componentWillReceiveProps(nextProps){
        this.updateElement(nextProps)
        this.updateState();
    }
    componentDidMount(){
        this.updateState();
    }
    componentWillUnmount(){
        this.stopListening();
    }
    updateState(){
        this.mapEditorProperties();
        this.setState( {
            controllers:this.controllers,
            name:this.props.name || this.entity.type + ' ' + this.entity.id
        })
    }
    mapEditorProperties(){
        this.controllers = {};
        if(!this.entity) return;
        const self = this;
        _.each(this.entity.editorProps.props,(config,prop)=>{
            const v =eval('self.entity.'+prop);
            self.controllers[prop] = _.extend({},config,{v:v})
        })
    }
    startListening(){
        if(this.entity){
            this.unWatchChange = this.entity.event.on('change',this.entityDidChange.bind(this));
            this.unWatchRemove = this.entity.event.on('willRemove',this.entityWillRemove.bind(this));
        }
    }
    stopListening(){
        this.entity && this.entity.event.off('change',this.unWatchChange );
        this.entity && this.entity.event.off('willRemove',this.unWatchRemove);
    }
    entityDidChange(){
        this.updateState();
    }
    entityWillRemove(){
        console.log("Removing " + this.props.entityId,"don't know what to do")
    }
    handleClick(){
        this.entity && this.props.scene.setSelectedObject(this.entity.id);
    }
    render(){

        return <Folder hide={this.props.hide} closed={this.props.closed} name={this.state.name} controllers={this.controllers} onClick={this.handleClick.bind(this)}/>
    }
} 

export default EntityController;