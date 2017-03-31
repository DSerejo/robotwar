'use strict';
import {cc} from '../../constants.js';
import {mix} from "../../../tools/mixwith/mixwith.js";
import {MessageListenerMixin} from "../../common/helpers/MessageListener.js";
class ConnectScene  extends mix(cc.Scene).with(MessageListenerMixin){
    constructor(robot,director){
        super();
        this.myRobot =robot;
        this.director = director
        this.topped = false;
        this.connection =  null;
        this.actionKeys = {};
        this.messageLabel = null;
        this.backgroundLayer = null;

    }
    onEnter () {
        super.onEnter();
        if(!this.backgroundLayer)
            this.startScene();
        window.scene = this;


    }
    startScene(){
        this.backgroundLayer = new cc.LayerColor(cc.color(255,255,255));
        this.addChild(this.backgroundLayer,-1);
        this.addMessageLabel();
    }
    setConnectionManager(connection){
        this.connection = connection;
    }
    addMessageLabel(){
        this.messageLabel = new cc.LabelTTF("Connecting to the server");
        this.messageLabel.setFontFillColor(cc.color(0, 0, 0, 255));
        this.messageLabel.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        this.addChild(this.messageLabel);
    }
    onConnect(){
        this.messageLabel.setString("Conntected!");
    }
    startSearchingOpponent(){
        this.connection.sendMessage('robot',this.myRobot);
        this.messageLabel.setString("Searching for opponent");
    }
    joinedRoom(packet){
        this.director.startGame(packet.d);
    }
    opponentNotFound(){
        this.messageLabel.setString("Could not find an opponent.");
    }
    setMessageLabel(message){
        this.messageLabel.setString(message);
    }


};
ConnectScene.prototype.acceptableMessages = {
    'room':'joinedRoom',
    'opponentNotFound':'opponentNotFound'
}
module.exports = ConnectScene;