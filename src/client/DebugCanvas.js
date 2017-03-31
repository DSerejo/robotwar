'use strict';
var cc = require('../constants').cc;
class DebugCanvas {

    constructor(gameCanvas,editor){
        this.enabled = false;
        var parent = gameCanvas.parentElement,
            canvas = this.createDebugCanvas();
        parent.insertBefore(canvas,parent.childNodes[0]);
        this.positionDebugCanvas(canvas,gameCanvas);
        this.canvas = canvas;
        this.hide();
        window.debuggerCanvas = this;
    }
    createDebugCanvas(){
        var canvas = document.createElement('canvas');
        canvas.id = 'box2d';
        return canvas;
    }
    positionDebugCanvas(canvas,gameCanvas){
        canvas.style.top = '0px'
        canvas.style.left = '0px'
        canvas.style.width = gameCanvas.style.width;
        canvas.style.height = gameCanvas.style.height;
        canvas.style.position = 'absolute';
        canvas.width = cc.view.getDesignResolutionSize().width
        canvas.height = cc.view.getDesignResolutionSize().height
        canvas.style['-webkit-transform'] = 'rotateX(180deg)'
        canvas.style['pointer-events'] = 'none'
    }
    listenEvents(editor){

    }

    hide(){
        this.canvas.style.display = 'none';
        this.enabled = false;
    }
    show(){
        this.canvas.style.display = 'initial';
        this.enabled = true;
    }
    toggle(){
        if(this.enabled)
            this.hide();
        else
            this.show();
    }
};
module.exports = DebugCanvas;