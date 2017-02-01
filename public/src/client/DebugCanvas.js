var DebugCanvas = cc.Class.extend({
    enabled:false,
    ctor:function(gameCanvas,editor){
        var parent = gameCanvas.parentElement,
            canvas = this.createDebugCanvas();
        parent.insertBefore(canvas,parent.childNodes[0]);
        this.positionDebugCanvas(canvas,gameCanvas);
        this.canvas = canvas;
        this.listenEvents(editor)
        this.hide();
        window.debuggerCanvas = this;
    },
    createDebugCanvas:function(){
        var canvas = document.createElement('canvas');
        canvas.id = 'box2d';
        return canvas;
    },
    positionDebugCanvas:function(canvas,gameCanvas){
        canvas.style.top = '0px'
        canvas.style.left = '0px'
        canvas.style.width = gameCanvas.style.width
        canvas.style.height = gameCanvas.style.height
        canvas.style.position = 'absolute'
        canvas.width = cc.view.getDesignResolutionSize().width
        canvas.height = cc.view.getDesignResolutionSize().height
        canvas.style['-webkit-transform'] = 'rotateX(180deg)'
    },
    listenEvents: function(editor){

    },

    hide:function(){
        this.canvas.style.display = 'none';
        this.enabled = false;
    },
    show:function(){
        this.canvas.style.display = 'initial';
        this.enabled = true;
    },
    toggle:function(){
        if(this.enabled)
            this.hide();
        else
            this.show();
    }


})