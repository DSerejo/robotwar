var cc = require('../../../constants').cc;

class Control{
    transform(){
        console.log('Override me')
    }
    onActive(){
        console.log('Rotate')
    }
    onInactive(){
        console.log('Rotate')
    }
}
module.exports = Control;