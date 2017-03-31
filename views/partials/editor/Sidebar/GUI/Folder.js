'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import ShortcutListener from './ShortcutListener';
import ControllerFactory from './ControllerFactory';

class Folder extends ShortcutListener{
    constructor(props){
        super(props)
        this.state = {
            closed:_.isUndefined(this.props.closed)?true:this.props.closed
        }
        this.toggle = this.toggle.bind(this);
        this.prepareKeyCallbacks();
        
    }
    
    mapControllers(controllers){
        this.controllers = [];
        _.each(controllers,(control,id)=>{
            this.addControl(id,control);
        })
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
    shortCutPressed(){
        this.toggle();
    }
    toggle(){
        this.setState({closed:!this.state.closed})
    }
    onClick(){
        let stop;
        this.props.onClick && (stop = this.props.onClick());
        if(!stop)
            this.toggle();
    }
    render(){
        this.mapControllers(this.props.controllers);
        const ulClassName = classNames({
            closed: this.state.closed,
            folder:true,
            hide:this.props.hide
        });
        const iconClassName = classNames({
            'glyphicon-triangle-right': this.state.closed,
            'glyphicon-triangle-bottom': !this.state.closed,
            glyphicon:true
        });
        return (<ul className={ulClassName}>
            <li className="title" onClick={this.onClick.bind(this)}>
                <span className={iconClassName}></span>
                {this.props.name}
            </li>
            { this.controllers}
        </ul>)
        

    }
}
export default Folder;