import React from 'react';
import classNames from 'classnames';
import {KeyCallbackComponent} from '../helpers.js';
class ComponentList extends KeyCallbackComponent{
    handleClick(type){
        if(!this.props.editorScene) return;
        this.props.editorScene.addNewObject(type)
        this.props.onChange();
    }
    keyPressed(key){
        switch (key){
            case 66: //b
                this.handleClick('box');
                break;
            case 73: //i
                this.handleClick('pin');
                break;
            case 80: //p
                this.handleClick('propulsor');
                break;
        }
    }
    render() {
        var className = classNames({
            hide: !this.props.show
        });

        return <div className={className}>
            <div><button onClick={this.handleClick.bind(this,'box')}>Box</button></div>
            <div><button onClick={this.handleClick.bind(this,'propulsor')}>Propulsor</button></div>
            <div><button onClick={this.handleClick.bind(this,'pin')}>Pin</button></div>
        </div>
    }

}
export default  ComponentList;
