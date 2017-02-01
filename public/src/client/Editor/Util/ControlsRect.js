var ControlsRect = cc.Node.extend({
    pointsConfig:{
        tl:{x:0,y:1,dx:-1,dy:1,scalePolicy:{x:true,y:true}},
        tm:{x:0.5,y:1,dx:0,dy:1},
        tr:{x:1,y:1,dx:1,dy:1},
        ml:{x:0,y:0.5,dx:-1,dy:0},
        mr:{x:1,y:0.5,dx:1,dy:0},
        bl:{x:0,y:0,dx:-1,dy:-1},
        bm:{x:0.5,y:0,dx:0,dy:-1},
        br:{x:1,y:0,dx:1,dy:-1},
        rot:{x:0.5,y:1,dx:0,dy:4,form:'circle'},
    },
    controlPointsUsed:null,
    controlPoints:[],
    config:{
        distance:7
    },
    ctor:function(controlPointsUsed,config){
        this._super()
        this.controlPointsUsed = controlPointsUsed;
        _.extend(this.config,config);
    },
    draw:function(){
        _.each(this.controlPointsUsed,this.checkControlPoint.bind(this))
    },
    checkControlPoint:function(isEnabled,pointId){
        if(isEnabled){
            this.drawPoint(pointId);
        }
    },
    drawPoint:function(pointId){
        var pointConfig = this.pointsConfig[pointId],
            point = pointId=='rot'?new ControlRotation(pointConfig):new ControlScale(pointConfig);
        point.setAnchorPoint(cc.p(0.5,0.5));
        point.setPosition(this.calcPointPosition(point));
        this.addChild(point);

    },
    calcPointPosition:function(point){
        var x = point.config.x * this.width + this.config.distance * point.config.dx,
            y = point.config.y * this.height + this.config.distance * point.config.dy;
        return cc.p(x,y);
    }
})