var EntityDef = function(){};
EntityDef.prototype.id = null;
EntityDef.prototype.body = null;
EntityDef.prototype.sprite = null;
EntityDef.prototype.lastKineticEnergy = 0;
EntityDef.prototype.material = null;
EntityDef.prototype.w = 0;
EntityDef.prototype.h = 0;
EntityDef.prototype.radius = 0;
EntityDef.prototype.pos = b2Vec2();
EntityDef.prototype.angle = 0;
EntityDef.prototype.type = null;
EntityDef.prototype.life = 1;
EntityDef.prototype.initialized = false;

EntityDef.prototype.ctor = function(world){
    this.world = world;
};
EntityDef.prototype.init = function(id,width,height,radius,pos,angle,material,type){
    if(!id){
        throw 'Need id';
    }
    this.id = id;
    this.body = null;
    this.sprite = null;
    this.lastKineticEnergy = 0;
    this.material = material || null;
    this.w = width || 0;
    this.h = height || 0;
    this.radius = radius || 0;
    this.pos = pos || new b2Vec2();
    this.angle = angle || 0;
    this.type = type;
};
EntityDef.prototype.remove = function(){
    this.sprite && this.removeFromParent();
    this.body && this.removeFromWorld();
};
EntityDef.prototype.removeFromParent = function(){
    this.sprite.removeFromParent();
};
EntityDef.prototype.removeFromWorld = function(){
    this.body.GetWorld().DestroyBody(this.body);
};
EntityDef.prototype.maxForceSupported = function(){
    return this.material.fakeFractionStrain*this.calculateArea();
};

EntityDef.prototype.calculateAppliedStress = function(stress,worldManifold){
    var localNormalVector,
        normal,
        distanceFromCenter0,
        distanceFromCenter1,
        totalStress,
        bendingFactors,
        damage;

    localNormalVector = this.body.GetLocalVector(worldManifold.m_normal);
    normal = this.prepareNormal(localNormalVector);
    distanceFromCenter0 = this.getDistanceFromCenter(normal,worldManifold.m_points[0]);
    distanceFromCenter1 = this.getDistanceFromCenter(normal,worldManifold.m_points[1]);
    bendingFactors = this.calculateBendingFactors(distanceFromCenter0,distanceFromCenter1);
    totalStress =  this.applyBendingFactorToStress(stress,bendingFactors);
    return totalStress
};
EntityDef.prototype.calculateAndApplyDamage = function(stress,worldManifold){
    var damage = this.calculateDamage(stress);
    this.applyDamage(damage);
};
EntityDef.prototype.prepareNormal  = function(localNormalVector){
    if(Math.abs(localNormalVector.x)>Math.abs(localNormalVector.y)){
        return cc.p(Math.round(localNormalVector.x),0);
    }
    return cc.p(0,Math.round(localNormalVector.y));
};
EntityDef.prototype.applyBendingFactorToStress  = function(stress,bendingFactors){
    var maxSupported = this.maxForceSupported(),
        appliedForce =stress[0]*bendingFactors[0] + stress[1]*bendingFactors[1],
        extraForce = [0.0],
        necessaryForceDisconsideringBending0,necessaryForceDisconsideringBending1;
    if(appliedForce>maxSupported){
        necessaryForceDisconsideringBending1 = maxSupported*(bendingFactors[0]+bendingFactors[1])/(stress[0]/stress[1] + 1);
        necessaryForceDisconsideringBending0 = necessaryForceDisconsideringBending1 *(stress[0]/stress[1]);
        extraForce = [stress[0]-necessaryForceDisconsideringBending0,stress[1]-necessaryForceDisconsideringBending1];
    }
    return [appliedForce,extraForce]
};
EntityDef.prototype.calculateBendingFactors  = function(distanceFromCenter0,distanceFromCenter1){
    var factor1 = Math.max(1-distanceFromCenter0,0.1);
    var factor2 = Math.max(1-distanceFromCenter1,0.1);
    return [factor1,factor2];
};
EntityDef.prototype.getDistanceFromCenter  = function(normal,point){
    var edge = this.getEdgeFromNormal(normal),
        edgeLength;

    if(Math.abs(normal.x)>0.5){
        edgeLength = Math.abs(edge[0].y - edge[1].y);
        return Math.abs(this.body.GetLocalPoint(point).y - this.body.GetLocalCenter().y)/(edgeLength/2);
    }else{
        edgeLength = Math.abs(edge[0].x - edge[1].x);
        return Math.abs(this.body.GetLocalPoint(point).x - this.body.GetLocalCenter().x)/(edgeLength/2);
    }
};
EntityDef.prototype.getEdgeFromNormal = function(normal){
    var p1,p2;
    if(normal.x ==0 && normal.y==1){
        p1 = this.body.GetFixtureList().m_shape.m_vertices[3];
        p2 = this.body.GetFixtureList().m_shape.m_vertices[2]
    }
    if(normal.x ==1 && normal.y==0){
        p1 = this.body.GetFixtureList().m_shape.m_vertices[1];
        p2 = this.body.GetFixtureList().m_shape.m_vertices[2]
    }
    if(normal.x ==0 && normal.y==-1){
        p1 = this.body.GetFixtureList().m_shape.m_vertices[0];
        p2 = this.body.GetFixtureList().m_shape.m_vertices[1]
    }
    if(normal.x ==-1 && normal.y==0){
        p1 = this.body.GetFixtureList().m_shape.m_vertices[0];
        p2 = this.body.GetFixtureList().m_shape.m_vertices[3]
    }
    return [p1,p2];
}
EntityDef.prototype.calculateDamage = function(stress){
    var bodyArea = this.calculateArea(),
        stressPerArea =stress/bodyArea;
    return this.material.calculateDeformationRatio(stressPerArea);
};
EntityDef.prototype.applyDamage = function(damage){
    if(damage>0){
        if(this.type!=='propulsor')
        new DamageSprite(damage,this);
    }
    this.life -= damage;
    console.log(this.id,this.life,damage);
    if(this.life<0){
        //this.isAlive = false;
    }
};

EntityDef.prototype.calculateArea = function(){
    return this.body.GetMass()/this.body.GetFixtureList().GetDensity()
};
EntityDef.prototype.updateKineticEnergy = function(){
    this.lastKineticEnergy  = EnergyCalc.kineticEnergy(this.body);
    this.lastLinVel = _.extend({},this.body.m_linearVelocity);
    this.lastAngVel = this.body.m_angularVelocity;
};
EntityDef.prototype.getDiffEnergy = function(){
    return this.lastKineticEnergy - EnergyCalc.kineticEnergy(this.body)
};
EntityDef.prototype.setActionKeys = function(actionKeys){
    this.actionKeys = actionKeys;
};

EntityDef.prototype.getActionKey = function(action){
    if(this.actionKeys && this.actionKeys[action])
        return this.actionKeys[action];
};
EntityDef.prototype.toObject = function(){
    var obj = {};
    if(!this.body) return obj;
    obj = {
        'class':this.type,
        material:this.material.name,
        angle:cc.radiansToDegrees(this.body.GetAngle()),
        position:this.body.GetPosition(),
        lv:this.body.GetLinearVelocity(),
        av: this.body.GetAngularVelocity(),
        id:this.id,
        type:this.body.GetType()
    };
    if (this.body.m_fixtureList.m_shape.m_type == Box2D.Collision.Shapes.b2Shape.e_circleShape){
        obj.radius = this.body.m_fixtureList.m_shape.m_radius;
    }
    else if (this.body.m_fixtureList.m_shape.m_type == Box2D.Collision.Shapes.b2Shape.e_polygonShape){
        var boxExtents = this.body.m_fixtureList.m_shape.m_vertices[2];
        obj.width = boxExtents.x*2;
        obj.height = boxExtents.y*2;
    }
    return obj;
};
var Entity = cc.Class.extend(EntityDef.prototype);
Entity.types = {
    box:'box',
    circle:'circle',
    propulsor:'propulsor'
};

var EnergyCalc = {}
EnergyCalc.bodyLinV = function(b){
    return cc.pLength(b.GetLinearVelocity())
}
EnergyCalc.kineticEnergy = function(b){
    return EnergyCalc.linearKineticEnergy(b) + EnergyCalc.rotationalKineticEnergy(b)
}
EnergyCalc.linearKineticEnergy = function(b){
    return 0.5 * b.GetMass() * Math.pow(EnergyCalc.bodyLinV(b),2);
}
EnergyCalc.rotationalKineticEnergy = function(b){
    return 0.5 * b.GetInertia() * Math.pow(b.GetAngularVelocity(),2);
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Entity;
}