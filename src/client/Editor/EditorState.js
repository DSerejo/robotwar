var EditorState = {
    currentStateIndex:null,
    states:[]
};
EditorState.restart = function(){
    EditorState.currentStateIndex = null;
    EditorState.states = []
};
EditorState.currentState = function(){
    return EditorState.currentStateIndex>=0?EditorState.states[EditorState.currentStateIndex]:{};
};
EditorState.loadFromDB = function(){
    var state =  window.localStorage.currentState?JSON.parse(window.localStorage.currentState):{};
    EditorState.pushState(state);
};
EditorState.pushState = function(state){
    if(EditorState.currentStateIndex!==null && EditorState.currentStateIndex<EditorState.states.length-1){
        EditorState.states = EditorState.states.slice(0,EditorState.currentStateIndex+1);
    }
    EditorState.states.push(state);
    EditorState.currentStateIndex=EditorState.states.length-1;
};
EditorState.prevState = function(){
    if(EditorState.currentStateIndex!==null && EditorState.currentStateIndex>0){
        EditorState.currentStateIndex--;
    }
    return EditorState.currentState();
};
EditorState.nextState = function(){
    if(EditorState.currentStateIndex!==null && EditorState.currentStateIndex<EditorState.states.length-1){
        EditorState.currentStateIndex++;
    }
    return EditorState.currentState();
};
module.exports = EditorState;