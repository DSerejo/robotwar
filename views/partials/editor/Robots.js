class RobotsVM {
    constructor(){
        this.currentRobotName = null;
        this.load();
    }
    load(){
        this.robotList = window.localStorage.robots ? JSON.parse(window.localStorage.robots) : [];
    }
    start(location){
        const robotName = location.query.robot;
        if(robotName){
            if(! this.robotList.length)
                return;
            if(this.robotList.indexOf(robotName)<0){
                return this.setCurrentRobotName(this.robotList[0]);
            }
        }
        else{
            if(this.robotList.length){
                return this.setCurrentRobotName(this.robotList[0]);
            }
        }
        return this.setCurrentRobotName(robotName);
    }
    setCurrentRobotName(name){
        this.currentRobotName = name;
        window.robotName = name;
    }
    addNew(name){
        this.robotList.push(name);
        window.localStorage.robots = JSON.stringify(this.robotList);
        window.localStorage['robot_'+name]="{}";
    }
    deleteRobotWithIndex(i){
        var name = this.robotList[i];
        this.robotList.splice(i,1);
        window.localStorage.robots = JSON.stringify(this.robotList);
        delete window.localStorage['robot_'+name];
    }
    getRobot(name){
        const robotJson = localStorage['robot_'+name];
        if(robotJson){
            return JSON.parse(robotJson)
        }
        return {}
    }
}
const robotsVM = new RobotsVM();
export default robotsVM;