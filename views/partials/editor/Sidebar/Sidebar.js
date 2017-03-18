import React from 'react'
import { Link,browserHistory } from 'react-router'
import robotsVM from '../../../../src/client/Editor/Robots.js'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import FormControl from 'react-bootstrap/lib/FormControl.js'
import FormGroup from 'react-bootstrap/lib/FormGroup.js'
import ControlLabel from 'react-bootstrap/lib/ControlLabel.js'
import _ from 'lodash'

class FieldGroup extends React.Component {
    render() {
        return  (
        <FormGroup controlId={this.props.id}>
            <ControlLabel>{this.props.label}</ControlLabel>
            <FormControl {...this.props} />
        </FormGroup>
    )};
}
class CreateNewModal extends React.Component{
    constructor(props){
        super(props);
        this.onSubmit = props.onSubmit || function(){}
        this.state = { showModal: false };
    }

    componentWillReceiveProps(nextProps){
        this.setState({ showModal: nextProps.showModal });
    }
    close(){
        this.onSubmit(false);
    }
    submit() {
        this.onSubmit(this.newRobotName.value)
    }
    render(){
        return <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title>New robot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={this.submit.bind(this)}>
                    <FieldGroup
                        id="newRobotName"
                        type="text"
                        label="Robot name"
                        placeholder="New robot name"
                        inputRef={ref => { this.newRobotName = ref; }}
                        />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.submit.bind(this)}>Create</Button>
            </Modal.Footer>
        </Modal>
    }
}
class MyRobotsSidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {showCreateNewModal:false}
    }
    componentWillMount(){
        this.checkAndSelectRobot()
    }
    checkAndSelectRobot(){
        if(robotsVM.currentRobotName !== this.props.location.query.robot){
            browserHistory.push('?robot='+robotsVM.currentRobotName);
        }
    }
    showCreateNew(){
        this.setState({showCreateNewModal:true})
    }
    createNew(name){
        if(name){
            this.setState({showCreateNewModal:false});
            robotsVM.addNew(name);
            browserHistory.push(_.extend({},this.props.location,{query:{robot:name}}));
        }

    }
    deleteRobot(i,event){
        robotsVM.deleteRobotWithIndex(i);
        robotsVM.start(this.props.location);
        this.checkAndSelectRobot();
        this.forceUpdate();
        event.stopPropagation();
    }

    render(){
        const self = this;
        const list = robotsVM.robotList.map(function(r,i){
            return <div key={i}>
                <Link
                    to={`?robot=${r}`}> {r}
                </Link>
                <Button onClick={self.deleteRobot.bind(self,i)}> Delete</Button>
            </div>
        });
        return <div className="sidebar">
            <div>
                My robots <Button onClick={this.showCreateNew.bind(this)}> + New</Button>
            </div>
            {list}
            <CreateNewModal showModal={this.state.showCreateNewModal} onSubmit={this.createNew.bind(this)} />
        </div>
    }
}
export default MyRobotsSidebar;
