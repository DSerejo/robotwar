var ClientManager = {
    clients:[]
};
ClientManager.addClient = function(client){
    this.clients.push(client);
};
ClientManager.removeClient = function(client){
    this.clients.splice(this.clients.indexOf(client),1);
};
module.exports = ClientManager;
