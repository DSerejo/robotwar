'use strict;'
import _ from 'lodash'
import React from 'react'
import {Folder,ButtonController,EntityController,SelectedElementController,StaticController,NumberController,SelectController,ComponentList,KeybindingController} from './index';
import classNames from 'classnames';
class ControllerFactory{
    static createController(name,control){
        
        if(_.isObject(control) && (control.static))
            return {type:'static',controller:<StaticController name={control.label || name} value={control.v} />};
        if(_.isObject(control) && control.folder){
            return {type:'folder',controller:<Folder name={name} closed={control.closed} hide={control.hide} shortCut={control.shortCut} controllers={control.controllers} />};
        }
        if(_.isObject(control) && control.button){
            return {type:'button',controller:<ButtonController hide={control.hide} name={control.label || name} action={control.action} shortCut={control.shortCut}/>};
        }
        if(_.isObject(control) && control.entity){
            return {type:'folder',controller:<EntityController entityId={name} manager={control.manager} scene={control.scene}/>};
        }
        if(_.isObject(control) && control.selectedElement){
            return {type:'folder',controller:<SelectedElementController hide={control.hide} scene={control.scene}/>};
        }
        if(_.isObject(control) && control.number){
            return   {type:'number',controller:<NumberController hide={control.hide} prop={name} onChange={control.onChange} label={control.label} value={control.v}/>};
        }
        if(_.isObject(control) && control.keybinding){
            return {type:'key',controller:<KeybindingController hide={control.hide} name={name} onChange={control.onChange} label={control.label} value={control.v}/>};
        }
        if(_.isObject(control) && control.select){
            return {type:'select',controller:<SelectController hide={control.hide} prop={name} onChange={control.onChange} label={control.label} value={control.v} options={control.options}/>};
        }
        if(_.isObject(control) && control.compList){
            return {type:'folder',controller:<ComponentList hide={control.hide} scene={control.scene} running={control.running} />};
        }
        return {type:'static',controller:<StaticController name={name} value={control.v} />};
    }
}
export default ControllerFactory;