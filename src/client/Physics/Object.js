'use strict';
var cc = require('../../constants').cc;
var BaseObject = require('./Base');
var _ = require('lodash');
var Mixin = require('../../../tools/mixwith/mixwith').Mixin;
var mix = require('../../../tools/mixwith/mixwith').mix;

module.exports = Mixin((sup) => {
        var mixed = mix(sup).with(BaseObject);
        class PhysicsObject extends mixed{}
        PhysicsObject.prototype.update = function (dt) {
            if(this.sprite!=null){
                this.setPosition(this.getPosition());
                this.setRotation(-this.getRotation());
            }
            else{
                var a = 0;
            }
        },
        PhysicsObject.prototype.setEntityManager = function(entityManager){
            this.entityManager = entityManager;
            
        }
            PhysicsObject.prototype.setPosition = function(p){
                this.sprite.setPosition(p)
            },
            PhysicsObject.prototype.setRotation = function(a){
                this.sprite.setRotation(a)
            },
            PhysicsObject.prototype.getPosition = function () {
                if(this.body){
                    var pos = this.body.GetPosition();
                    return cc.pMult(pos,PMR/WORLD_SCALE);
                }
            },
            PhysicsObject.prototype.getRotation = function () {
                if(this.body)
                    return cc.radiansToDegrees(this.body.GetAngle());
            },

            PhysicsObject.prototype.getBody = function () {
                return this.body;
            },
            PhysicsObject.prototype.removeFromParent = function () {
                this.removeBody();
                this.sprite.removeFromParent();
                this.sprite = null;
            },
            PhysicsObject.prototype.removeBody = function(){
                if(this.body){
                    var joints = this.jointsToBeUpdated();
                    this.world.DestroyBody(this.body);
                    this.removeJoints(joints);
                }
                this.shape = null;
            };
        PhysicsObject.prototype.jointsToBeUpdated = function(){
            var joint = this.body.GetJointList(),
                joints = [];
            if(!joint) return joints;
            do{
                joints.push(joint.joint.m_userData);
            } while(joint = joint.next);
            return joints;

        };
        PhysicsObject.prototype.removeJoints = function(joints){
            joints.forEach(function(j){
                j.joint =null;
                j.recreateSprite()
            })
        };
        PhysicsObject.prototype.checkJointsToAdd = function(){
            var self = this;
            _.each(self.entityManager.joints,function(j){
                var worldPosition = j.sprite.getParent().convertToWorldSpace(j.sprite.getPosition());
                if(!j.joint && self.isTouched(worldPosition)){
                    j.checkAndCreateJoint();
                    j.recreateSprite();
                }
            })
        };
        return PhysicsObject;
    }
);