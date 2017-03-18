'use strict';
var cc = require('../../constants').cc;
class DamageHandler{
    constructor(world,entityManager){
        this.world = world;
        this.entityManager = entityManager
    }
    updateKineticEnergy(obj1,obj2){
        obj1.updateKineticEnergy && obj1.updateKineticEnergy();
        obj2.updateKineticEnergy && obj2.updateKineticEnergy();
    }
    checkAndApplyDamage(obj1,obj2,contact,impulse){
        if(!obj1.body || !obj2.body) return;
        const impactForce = this.calculateImpactForce(obj1,obj2,impulse),
            impactArea = this.calculateImpactArea(contact),
            stress = [impactForce[0]/impactArea,contact.m_manifold.m_pointCount==2?impactForce[1]/impactArea:0],
            worldManifold = new b2WorldManifold();

        contact.GetWorldManifold(worldManifold);

        this.updateDamage(obj1,obj2,stress,worldManifold);
    }
    calculateImpactArea(contact){
        if(contact.m_manifold.m_pointCount==1){
            return 0.1;
        }else{
            return cc.pDistance(contact.m_manifold.m_points[0].m_localPoint,contact.m_manifold.m_points[1].m_localPoint);
        }
    }
    calculateImpactForce(obj1,obj2,impulse){
        var restitution = Box2D.Common.b2Settings.b2MixRestitution(obj1.body.GetFixtureList().m_restitution,obj2.body.GetFixtureList().m_restitution),
            factor = (1-restitution)/(1+restitution);
        return [impulse.normalImpulses[0]*this.world.m_inv_dt0*factor,impulse.normalImpulses[0]*this.world.m_inv_dt0*factor] ;
    }
    updateDamage(obj1,obj2,stress,worldManifold){
        var appliedStress1 = obj1.damage.calculateAppliedStress(stress,worldManifold);
        if(appliedStress1[1][0]>0){

        }
        var appliedStress2 = obj2.damage.calculateAppliedStress(stress,worldManifold);

        obj1.damage.calculateAndApplyDamage && obj1.damage.calculateAndApplyDamage(stress,worldManifold);
        obj2.damage.calculateAndApplyDamage && obj2.damage.calculateAndApplyDamage(stress,worldManifold);
    }

}
class ContactListener{
    constructor(world,entityManager){
        var listener = new b2ContactListener();
        listener.PreSolve = this.PreSolve.bind(this);
        listener.PostSolve = this.PostSolve.bind(this);
        world.SetContactListener(listener);
        this.damageHandler = new DamageHandler(world,entityManager);
        this.world = world;
    }
    PreSolve (contact, oldManifold) {
        var body1 = contact.GetFixtureA().GetBody(),
            body2 = contact.GetFixtureB().GetBody(),
            obj1 = body1.GetUserData(),
            obj2 = body2.GetUserData();
        this.damageHandler.updateKineticEnergy(obj1,obj2);
    }
    PostSolve (contact, impulse) {
        if(impulse.normalImpulses[0]>1){
            var obj1 = contact.GetFixtureA().GetBody().GetUserData(),
                obj2 = contact.GetFixtureB().GetBody().GetUserData();
            if(obj1.id=='ground') return;
            this.damageHandler.checkAndApplyDamage(obj1,obj2,contact,impulse);
        }
    }
}
module.exports = ContactListener;