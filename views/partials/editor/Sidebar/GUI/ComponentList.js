import React from 'react';
import {cc} from '../../../../../src/constants.js';
import Materials from '../../../../../src/common/Physics/Materials.js'
import _ from 'lodash';
import Folder from './Folder';

const materialOptions = _.filter(_.map(Materials,(m,id)=>{
    if(['default','ground'].indexOf(id)<0){
        return {value:id,label:id};
    }
}))

class CreateOptions{
    constructor(initOptions){
        this.options = {};
        _.each(initOptions,(o)=>{
            if(CreateOptions.availableOptions[o]){
                this.options[o] = CreateOptions.availableOptions[o];
            }
        })
    }
    
}
CreateOptions.availableOptions = {
    'material':{label:'Material',select:true,options:materialOptions,v:'wood'},
    'w':{number:true,v:1},
    'h':{number:true,v:1},
    'force':{number:true,v:30},
    'actionKeys.start':{label:'start',keybinding:true,v:68}
}

class ComponentList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            type:'box'
        }
        this.types = this.getAvailableTypes()
    }
    componentWillMount(){
        if(!this.state.options)
            this.updateOptionsState(this.state.type);
    }
	map(){
        const scene = this.props.scene;
        const controllers = _.extend(
                {Type:{select:true,v:'box',options:this.types,onChange:(t)=>{this.setState({type:t});this.updateOptionsState(t)}}},
                this.getComponentOptions(),
                {Add:{button:true,action:this.addComponent.bind(this,scene)}}
            );         
        return controllers;
    }
    getAvailableTypes(){
        return _.map(ComponentList.availableCreateOptions,(o,type)=>{
            return {value:type,label:type}
        })
    }
    getComponentOptions(){
        let options = _.extend({},ComponentList.availableCreateOptions[this.state.type].options);
         let  stateOptions = {}
        _.each(options,(o,prop)=>{
            stateOptions[prop] = o.v
            o.onChange = (v)=>{
                const ops = this.state.options;
                this.setProp(ops,prop,v)
                o.v = v
                this.setState({options:ops});
            }
        })
        //this.setState({options:stateOptions})
        return options;
    }
    updateOptionsState(t){
        let options = _.extend({},ComponentList.availableCreateOptions[t].options);
         let  stateOptions = {}
        _.each(options,(o,prop)=>{
            this.setProp(stateOptions,prop,o.v)
        })
        this.setState({options:stateOptions})
    }
    setProp(obj,prop,value){
        if(prop.indexOf('.')>=0){
            const path = prop.split('.');
            walk(obj,0);
            function walk (obj,i){
                const part = path[i];
                if(i<path.length-1 && !obj[part] )
                    obj[part] = {};
                if(i==path.length-1){
                    obj[part] = value;
                }else{
                    walk(obj[part],i+1)
                }
            }
        }
        else obj[prop] = value
    }
    addComponent(scene){
        scene.addNewObject(this.state.type,this.state.options);
        window.cc._canvas.focus();
    }
    render(){

        return <Folder name={'Add element'} hide={this.props.hide} controllers={this.map()}/>;
    }
}
ComponentList.availableCreateOptions = {
    'box':  new CreateOptions(['material','w','h']),
    'pin':  new CreateOptions([]),
    'propulsor': new CreateOptions(['force','actionKeys.start']),
}
export default  ComponentList;
