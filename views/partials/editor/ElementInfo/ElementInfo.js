import React from 'react';
import {KeyCallbackComponent} from '../helpers.js';
var KeyPressed = {
    shiftPressed:false,
    ctrlPressed:false
};
class ElementInfo extends KeyCallbackComponent{
    constructor(props){
        super(props);
        this.canMove = true;

    }
    updateElement(){
        this.props.element.updateBodyFromSprite && this.props.element.updateBodyFromSprite();
        this.props.editorLayerCallbacks.setSelectedObject(this.props.element);
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
        var dX = 0.1,
            dA = 3,
            mult = KeyPressed.shiftPressed?0.1:1,
            doNotUpdate = false;
        switch (key){
            case 65: //a
                this.canMove && this.props.element.addX(-1*dX*mult);
                break;
            case 68: //d
                this.canMove && this.props.element.addX(dX*mult);
                break;
            case 83: //s
                this.canMove && this.props.element.addY(-1*dX*mult);
                break;
            case 87: //w
                this.canMove && this.props.element.addY(dX*mult);
                break;
            case 69: //e
                this.canMove &&this.props.element.addAngle(dA*mult);
                break;
            case 81: //q
                this.canMove &&this.props.element.addAngle(-1*dA*mult);
                break;
            case 16: //shift
                KeyPressed.shiftPressed = true;
                break;
            case 17: //ctrl
                KeyPressed.ctrlPressed = true;
                break;
            case 46: //delete
                this.props.editorScene.removeSelectedObject();
                doNotUpdate = true;
                break;
            case 27: //esc
                this.props.editorScene.setAllObjectsToInactive();
                doNotUpdate = true;
                break;
            default:
                doNotUpdate = true;
                break;
        }
        if(!doNotUpdate)
            this.forceUpdate();

    }
    rows(){}
    render(){
        var info = this.props.element?this.props.element.toObject():{};
        if (!(info && info.id)) return null;
        return <div>
            <div>Id: {info.id}, {info.class}</div>
            {this.rows()}
        </div>
    }
}

module.exports = ElementInfo;