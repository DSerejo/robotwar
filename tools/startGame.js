window.localStorage['robot_oi']='{}';
window.robotName = 'oi';
window.started = false;
const game = new window.Game({},()=>{
    if(!window.started){
        window.__karma__ && window.__karma__.start();
        window.started = true;
    }

})
