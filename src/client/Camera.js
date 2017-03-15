class Camera{
    
    ctor(layer){
        this.layer = layer;
        this.setDefaults();
        
    }
    setDefaults(){
        this.position = {
            x:0,
            y:0
        }
        this.offset = {x:400,y:200}
    }
    moveBy(x,y){
        this.position.x+=x;
        this.position.y+=y;
        this.notify();
    }
    moveTo(x,y){
        this.position.x=x;
        this.position.y=y;
        this.notify();
    }
    moveToFitSprite(sprite){
        var spritePos = sprite.getPosition();
        var minYPos = cc.convertMetersToPixel(7);
        var maxYPos = -cc.convertMetersToPixel(30);
        var newPos = {
            x:this.offset.x-spritePos.x,
            y:Math.max(maxYPos,Math.min(minYPos,this.offset.y-spritePos.y))
        };
        this.moveTo(newPos.x*WORLD_SCALE,newPos.y*WORLD_SCALE);
    }
    notify(){}
}
module.exports = Camera