'use strict';
var cc = require('../../constants').cc;
var BoxSprite = require('../Components/Box/BoxSprite');
var Mixin = require('../../../tools/mixwith/mixwith').Mixin;
var EventClass = require('event-class');
var _ = require('lodash');
class EditorProperties{
    constructor(props){
        this.props = props
    }
    addProperties(props){
        this.props = _.extend(this.props,props);
    }
    removeProperty(prop){
        delete this.props[prop];
    }
    removeProperties(props){
        props.forEach((p)=>this.removeProperty(p));
    }
}


module.exports = Mixin((sup) => {
        class Base extends sup{
            constructor(...args){
                super(...args);
                this.editorProps = new EditorProperties({
                    'type':{static:true},
                    'id':{static:true},
                    'material.name':{'label':'material','static':true},
                    'w':{number:true,onChange:(w)=>{this.w = w; this.recreateSprite();this.event.trigger('change:prop:w')}},
                    'h':{number:true},
                    'pos.x':{'label':'x',number:true},
                    'pos.y':{'label':'y',number:true},
                    'angle':{number:true}
                })
                this.event = new EventClass();
            }
            isTouched(p){
                var rect = new cc.Rect(0,0,this.sprite._contentSize.width, this.sprite._contentSize.height),
                    localPoint = this.sprite.convertToNodeSpace(p),
                    localPoint2 = this.sprite.convertToNodeSpace(cc.pMult(p,WORLD_SCALE));

                return cc.rectContainsPoint(rect,localPoint);
            }
            isSelected(){
                return this.sprite&&this.sprite.getChildByName('selected') !== null
            }
            select(){
                this.unSelect();
                var sprite  = new BoxSprite(this.sprite.getContentSize().width,this.sprite.getContentSize().height,'#1c59bc',50);
                this.sprite.addChild(sprite,1,'selected')
                this.selectedNode = sprite;
            }
            updateBodyFromSprite(){
                throw "Must be implemented";
            }
            unSelect(){
                if(this.selectedNode){
                    this.selectedNode.removeFromParent()
                }
                this.selectedNode = null
            }
            recreateSprite(){
                var oldSpriteConfig = this.removeSprite();
                this.createSpriteObject();
                if(this.body)
                    this.sprite.setPosition(cc.convertMetersToPoint(this.body.GetPosition()));
                else{
                    this.sprite.setPosition(cc.convertMetersToPoint(this.pos));
                }
                if(!this.options.delayedPosition){
                    this.sprite.init(this);
                }
                if(oldSpriteConfig && oldSpriteConfig.parent){
                    oldSpriteConfig.parent.addChild(this.sprite,oldSpriteConfig.zOrder);
                    oldSpriteConfig.isSelected && this.select()
                }
            }
            removeSprite (){
                if(this.sprite){
                    var parent = this.sprite.parent,
                        zOrder = this.sprite.getLocalZOrder(),
                        isSelected = this.isSelected();
                    this.sprite.removeAllChildren();
                    this.sprite.removeFromParent();
                    this.sprite = null;
                    return {parent:parent,zOrder:zOrder,isSelected:isSelected}
                }
            }
            addX(dX){
                this.sprite.setPosition(cc.convertMetersToPoint(cc.p(this.pos.x+dX,this.pos.y)));
                this.updateBodyFromSprite();
            }
            addY(dY){
                this.sprite.setPosition(cc.convertMetersToPoint(cc.p(this.pos.x,this.pos.y+dY)));
                this.updateBodyFromSprite();
            }
            addW(dW){
                this.w = this.w+dW;
                this.recreateSprite();
                this.updateBodyFromSprite();
            }
            
            addH(dh){
                this.h = this.h+dh;
                this.recreateSprite();
                this.updateBodyFromSprite();
            }
            addAngle(dA){
                this.sprite.setRotation(-this.angle + dA);
                this.updateBodyFromSprite();
            }
        }
        Base.prototype.options = {};
        
        return Base;
}
);