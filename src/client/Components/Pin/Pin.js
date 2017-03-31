import {mix} from '../../../../tools/mixwith/mixwith.js';
import {cc} from '../../../constants';
import PinPhysics from '../../../common/Components/Pin';
import BaseObject from '../../Physics/Base';
import PinSprite from './PinSprite';

var mixed = mix(PinPhysics).with(BaseObject);
class Pin extends mixed{
    constructor(id,pos,fixtures,world){
        super(id,pos,fixtures,world);
        this.setDefaults();
        this.recreateSprite();
        this.editorProps.removeProperties(['material.name','h','w','angle'])
    }
    setDefaults(){
        this.radius = 4;
        this.joinedColor = '#28cc12';
        this.unJoinedColor =  '#ff878b';
    }
    createSpriteObject(){
        this.sprite = new PinSprite(this.radius,this.joint?this.joinedColor:this.unJoinedColor);
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
        this.sprite.setAnchorPoint(0.5,0.5)
    }
    updateBodyFromSprite(){
        if(!this.sprite)
            return;
        this.pos = cc.convertPointToMeters(this.sprite.getPosition());
        this.removeJoint();
        this.checkAndCreateJoint();
        this.recreateSprite();
    }
    update(dt){
        if(!this.joint)
            return;
        this.pos = this.joint.GetAnchorA();
        this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
    }
    removeFromParent () {
        this.removeJoint();
        this.sprite.removeFromParent();
        this.sprite = null;
    }
}
export default Pin;