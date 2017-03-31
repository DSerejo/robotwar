'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import {KeyCallbackComponent} from '../../helpers.js';
import EntityController from './EntityController';

var KeyPressed = {
    shiftPressed:false,
    ctrlPressed:false
};
class SelectedElementController extends KeyCallbackComponent{
    constructor(props){
        super(props);
        this.state = {hide:true};
        this.manager = this.props.scene.getEntityManager();
        this.canMove = true;
        this.priority = 1;
    }
    componentDidMount(){
        this.updateState();
    }
    componentWillReceiveProps(nextProps){
        this.updateState();
    }
    componentWillMount(){
        super.componentWillMount();
        this.props.scene && (this.stopListening = this.props.scene.event.on('change:selectedObject',this.updateState.bind(this)));
    }
    componentWillUnmount(){
        super.componentWillUnmount();
        this.props.scene.event.off('change:selectedObject',this.stopListening);
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
    keyPressed(key,stopPropagation){
        var dX = 0.1,
            dA = 3,
            mult = KeyPressed.shiftPressed?0.1:1,
            doNotUpdate = false;
        switch (key){
            case 37: //left
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addW(-1*dX*mult);
                stopPropagation();
                break;
            case 38: //up
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addH(dX*mult);
                break;
            case 39: //right
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addW(dX*mult);
                break;
            case 40: //down
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addH(-1*dX*mult);
                break;
            case 65: //a
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addX(-1*dX*mult);
                stopPropagation();
                break;
            case 68: //d
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addX(dX*mult);
                break;
            case 83: //s
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addY(-1*dX*mult);
                break;
            case 87: //w
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addY(dX*mult);
                break;
            case 69: //e
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addAngle(dA*mult);
                break;
            case 81: //q
                this.canMove && this.state.selectedElement && this.state.selectedElement.id && this.state.selectedElement.addAngle(-1*dA*mult);
                break;
            case 188: //,
                this.props.scene && this.props.scene.selectedPrevObject();
                break;
            case 190: //.
                this.props.scene && this.props.scene.selectedNextObject();
                break;
            case 16: //shift
                KeyPressed.shiftPressed = true;
                break;
            case 17: //ctrl
                KeyPressed.ctrlPressed = true;
                break;
            case 46: //delete
                this.props.scene.removeSelectedObject();
                doNotUpdate = true;
                break;
            case 27: //esc
                this.props.scene.setAllObjectsToInactive();
                doNotUpdate = true;
                break;
            default:
                doNotUpdate = true;
                break;
        }
        if(!doNotUpdate)
            this.updateState();

    }
    updateState(){
        const selectedElement = this.props.scene.getSelectedObject();
        this.setState({
            selectedElement:selectedElement || {}
        })
    }
    
    render(){
        const selectedElement = this.state.selectedElement || {}
        return <EntityController hide={!this.props.scene.selectedObject || this.props.hide} closed={false} scene={this.props.scene} name={'Selected'} entityId={selectedElement.id} manager={this.manager}/>
    }
}   
export default SelectedElementController;