var ControlButton = cc.Node.extend({
    fillColor:"#42b9f4",
    fileName:null,
    ctor:function(){
        this._super()
        this.createButton()
    },
    createButton:function(){
        if(this.fileName) return this.createFromFileName()
        var dn  = new cc.DrawNode();
        dn.drawRect(cc.p(0,0), cc.p(20,20), cc.color(this.fillColor), 1, cc.color("#6D6D6D"));
        this.addChild(dn);
        this.setContentSize(20,20)
    },
    createFromFileName:function(){
        var sprite = new cc.Sprite(this.fileName + 'Normal.png')
        this.addChild(sprite);
        sprite.setScale(20/30,20/26)
        sprite.setContentSize(20,20)
        sprite.setAnchorPoint(0,0.5)

        this.sprite = sprite
    },
    onActive:function(){
        if(!this.fileName) return;
        this.sprite.initWithFile(this.fileName + 'Selected.png')
        this.sprite.setAnchorPoint(0,0.5)
    },
    onInactive:function(){
        if(!this.fileName) return;
        this.sprite.initWithFile(this.fileName + 'Normal.png')
        this.sprite.setAnchorPoint(0,0.5)
    },
    transform:function(){
        console.log('Overrid me')
    }
})