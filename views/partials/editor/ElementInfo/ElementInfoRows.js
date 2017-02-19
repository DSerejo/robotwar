import React from 'react';
import keydown from 'react-keydown';
import keycodes from '../../keycodes.js'
import {KeyCallbackComponent} from '../helpers.js';
class ElementProp extends React.Component{
    constructor(props){
        super(props);
        this.state = {value : this.props.value}
    }
    componentWillReceiveProps(nextProps){
        this.setState({value : nextProps.value})
    }
    transform(element,info,value){}
    change(event){
        this.setState({value:event.target.value});
    }
    keyPressed(event){
        if(event.key == 'Enter'){
            var info = this.props.element.toObject();
            var cc = window.cc;
            this.transform(this.props.element,info,this.state.value);
            World.pushState();
            if(this.props.update)
                this.props.update()
        }
    }
    render(){
        return <input type="number" value={this.state.value} onChange={this.change.bind(this)} onKeyPress={this.keyPressed.bind(this)} />
    }
}
class PositionX extends ElementProp{
    transform(element,info,value){
        element.sprite.setPosition(cc.convertMetersToPoint(cc.p(value,info.position.y)));
    }
}
class PositionY extends ElementProp{
    transform(element,info,value){
        element.sprite.setPosition(cc.convertMetersToPoint(cc.p(info.position.x,value)));
    }
}
class Width extends ElementProp{
    transform(element,info,value){
        value = Math.max(window.MIN_SIZE,value);
        element.w = value;
        element.recreateSprite();
    }
}
class Height extends ElementProp{
    transform(element,info,value){
        value = Math.max(window.MIN_SIZE,value);
        element.h = value;
        element.recreateSprite();
    }
}
class Angle extends ElementProp{
    transform(element,info,value){
        element.setRotation(-1 * value);
    }
}

class ActionKeyProp_ extends KeyCallbackComponent{
    constructor(props){
        super(props);
        this.state = {actionKey : props.actionKey,editing:false}
    }
    handleClick(){
        this.setState({editing:true,actionKey:-1});
        this.button.blur();
    }
    componentWillReceiveProps( nextProps ) {
        if(this.state.editing){
            const { keydown: { event } } = nextProps;
            if ( event ) {
                this.setState( {editing:false} );
                this.props.element.actionKeys[this.props.action] = event.which;
                this.props.update();
                cc._canvas.focus();
            }
        }else{
            const {actionKey} = nextProps;
            this.setState( { actionKey: actionKey} );
        }
    }
    keyPressed(key){
        if(key == 84) { //t
            this.button.focus()
            this.handleClick()
        }
    }
    convertCodeToString(){
        return this.state.actionKey>=0?keycodes[this.state.actionKey]:'<_>';
    }
    render(){
        return <span>
            {this.convertCodeToString()}
            <button ref={(c)=>this.button=c}onClick={this.handleClick.bind(this)}>Edit</button>
        </span>;
    }
}
const ActionKeyProp = keydown(ActionKeyProp_);
class CustomProp extends ElementProp{
    transform(element,info,value){
        element[this.props.prop] = value;
    }
}
class ElementInfoRow extends React.Component{
    constructor(props){
        super(props);
        this.state = this.props.element.toObject();
    }
    componentWillReceiveProps(nextProps){
        this.setState(nextProps.element.toObject());
    }
}
class PositionRow extends ElementInfoRow{
    render(){
        if(this.props.static){
            return <div>Position - x: this.state.position.x, y: this.state.position.y</div>
        }else
            return <div>Position -
            <PositionX value={this.state.position.x} update={this.props.updateElement} element={this.props.element}/>
            <PositionY value={this.state.position.y} update={this.props.updateElement} element={this.props.element}/>
        </div>
    }
}
class SizeRow extends ElementInfoRow{
    render(){
        if(this.props.static){
            return <div>Size - width: {this.state.width}, height: {this.state.height}</div>
        }
        return <div>Size:
            <Width value={this.state.width} update={this.props.updateElement} element={this.props.element}/>,
            <Height value={this.state.height} update={this.props.updateElement} element={this.props.element}/>
        </div>
    }
}
class AngleRow extends ElementInfoRow{
    render(){
        return <div>Angle:
            <Angle value={this.state.angle} update={this.props.updateElement} element={this.props.element}/>
        </div>
    }
}
class FixturesRow extends ElementInfoRow{
    render(){
        if(!this.state.bodyAId) return null;
        return <div>Joining elements: {this.state.bodyAId} and {this.state.bodyBId}</div>
    }
}
class JoinedRow extends ElementInfoRow{
    mapJoinedObjects(){
        var objectIds = [];
        var joint = this.props.element.body.GetJointList();
        do {
           var objectId = joint.other.GetUserData().id;
            if(objectIds.indexOf(objectId)<0)
                objectIds.push(objectId);
        } while (joint = joint.next);
        return objectIds
    }
    render(){
        if(!this.props.element.body.GetJointList()) return null;
        return <div>Joined object ids: {this.mapJoinedObjects().join(', ')}</div>
    }
}
class CustomPropRow extends ElementInfoRow {
    render(){
        var propLowerCase = this.props.prop.toLowerCase();
        if(this.props.static){
            return <div>{this.props.prop}: {this.state[propLowerCase]}</div>
        }
        return <div>{this.props.prop}:
            <CustomProp value={this.state[propLowerCase]} update={this.props.updateElement} element={this.props.element} prop={propLowerCase}/>
        </div>
    }
}
class ActionKeyRow extends ElementInfoRow {
    render(){
        var propLowerCase = this.props.prop.toLowerCase();
        return <div>
            {this.props.prop}:
            <ActionKeyProp actionKey={this.state.actionKeys[propLowerCase]} action={propLowerCase} update={this.props.updateElement} element={this.props.element} />
            </div>

    }

}

export {PositionRow, SizeRow, AngleRow,CustomPropRow,FixturesRow,JoinedRow,ActionKeyRow};
