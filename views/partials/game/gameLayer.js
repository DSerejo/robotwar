import React from 'react';
import robotsVM from '../../../src/client/Editor/Robots.js';
//require('../../../testhelpers');

class GameLayer extends React.Component{
    constructor(props){
        super(props);
        this.started = false;
        this.init();

    }
    //init(){}
    init(){
        GameLoader(this);
        this.started = true
    }
    componentWillReceiveProps(nextProps){
        const {location} = nextProps,
            nextRobot = location.query.robot,
            currentRobot = this.props.location.query.robot;
        if(nextRobot && nextRobot != currentRobot){
            const robotJson = localStorage['robot_'+nextRobot];
            if(robotJson){
                robotsVM.setCurrentRobotName(nextRobot);
                const robot = JSON.parse(robotJson);
                if(this.scene)
                    this.scene.restartWith(robot);
                else if(!this.started)
                    this.init();
            }
        }
    }
    render(){
        return <canvas id="gameCanvas" width="321" height="480"></canvas>
    }
}
module.exports = GameLayer