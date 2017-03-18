var DirectorBase = require('../Director');
var BattleScene = require('./BattleScene');
var ConnectScene = require('./ConnectScene');
class BattleDirector extends DirectorBase{
    
    constructor(connectionManager,extraOptions){
        super();
        this.currentScene = null;
        this.connectionManager = connectionManager;
        this.connectionScene =  new ConnectScene(extraOptions.robot,this)
        this.pushScene(this.connectionScene);
    }
    startGame(room){
        this.pushScene(new BattleScene(this,room));
    }
    endGame(reason){
        this.pushScene(this.connectionScene);
        this.connectionScene.setMessageLabel(BattleDirector.endGameMessages[reason]);
    }
    pushScene(scene){
        this.currentScene = scene;
        this.currentScene.setConnectionManager(this.connectionManager);
        this.connectionManager.setScene(this.currentScene);
        this.runScene();
    }
};
BattleDirector.endGameMessages = {
    'gameEnd':'Game End',
    'opponentLeft':'Your opponent has left the game',
    'lostConnection':'Conennection Lost',
    'win':'You win!!',
    'lose':'You lose :('
};

module.exports = BattleDirector;