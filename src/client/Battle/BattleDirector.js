var BattleDirector = DirectorBase.extend({
    currentScene:null,
    connectionManager:null,
    connectionScene:null,
    ctor:function(connectionManager,extraOptions){
        this.connectionManager = connectionManager;
        this.connectionScene =  new ConnectScene(extraOptions.robot,this)
        this.pushScene(this.connectionScene);
    },
    startGame:function(room){
        this.pushScene(new BattleScene(this,room));
    },
    endGame:function(reason){
        this.pushScene(this.connectionScene);
        this.connectionScene.setMessageLabel(BattleDirector.endGameMessages[reason]);
    },
    pushScene:function(scene){
        this.currentScene = scene;
        this.currentScene.setConnectionManager(this.connectionManager);
        this.connectionManager.setScene(this.currentScene);
        this.runScene();
    }
});
BattleDirector.endGameMessages = {
    'gameEnd':'Game End',
    'opponentLeft':'Your opponent has left the game',
    'lostConnection':'Conennection Lost',
    'win':'You win!!',
    'lose':'You lose :('
};