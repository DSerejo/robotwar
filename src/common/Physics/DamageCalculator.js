var DamageCalculator = function(){};
DamageCalculator.prototype.entity = null;
DamageCalculator.prototype.body = null;
DamageCalculator.prototype.ctor = function(entity){
    this.entity = entity;
    this.body = entity.body;
    this.material = entity.material;
}
DamageCalculator.prototype.maxForceSupported = function(){
    return this.material.fakeFractionStrain*this.entity.calculateArea();
};

DamageCalculator.prototype.calculateAppliedStress = function(stress,worldManifold){
    var localNormalVector,
        normal,
        distanceFromCenter0,
        distanceFromCenter1,
        totalStress,
        bendingFactors;

    localNormalVector = this.body.GetLocalVector(worldManifold.m_normal);
    normal = this._prepareNormal(localNormalVector);
    distanceFromCenter0 = this._getDistanceFromCenter(normal,worldManifold.m_points[0]);
    distanceFromCenter1 = this._getDistanceFromCenter(normal,worldManifold.m_points[1]);
    bendingFactors = this._calculateBendingFactors(distanceFromCenter0,distanceFromCenter1);
    totalStress =  this._applyBendingFactorToStress(stress,bendingFactors);
    return totalStress
};
DamageCalculator.prototype.calculateAndApplyDamage = function(stress){
    var damage = this._calculateDamage(stress);
    this._applyDamage(damage);
};
DamageCalculator.prototype._prepareNormal  = function(localNormalVector){
    if(Math.abs(localNormalVector.x)>Math.abs(localNormalVector.y)){
        return cc.p(Math.round(localNormalVector.x),0);
    }
    return cc.p(0,Math.round(localNormalVector.y));
};
DamageCalculator.prototype._applyBendingFactorToStress  = function(stress,bendingFactors){
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
DamageCalculator.prototype._calculateBendingFactors  = function(distanceFromCenter0,distanceFromCenter1){
    var factor1 = Math.max(1-distanceFromCenter0,0.1);
    var factor2 = Math.max(1-distanceFromCenter1,0.1);
    return [factor1,factor2];
};
DamageCalculator.prototype._getDistanceFromCenter  = function(normal,point){
    var edge = this._getEdgeFromNormal(normal),
        edgeLength;

    if(Math.abs(normal.x)>0.5){
        edgeLength = Math.abs(edge[0].y - edge[1].y);
        return Math.abs(this.body.GetLocalPoint(point).y - this.body.GetLocalCenter().y)/(edgeLength/2);
    }else{
        edgeLength = Math.abs(edge[0].x - edge[1].x);
        return Math.abs(this.body.GetLocalPoint(point).x - this.body.GetLocalCenter().x)/(edgeLength/2);
    }
};
DamageCalculator.prototype._getEdgeFromNormal = function(normal){
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
};
DamageCalculator.prototype._calculateDamage = function(stress){
    var bodyArea = this.entity.calculateArea(),
        stressPerArea =stress/bodyArea;
    return this.material.calculateDeformationRatio(stressPerArea);
};
DamageCalculator.prototype._applyDamage = function(damage){
    //if(damage>0){
    //    if(this.type!=='propulsor')
    //        new DamageSprite(damage,this);
    //}
    this.entity.life -= damage;
    if(this.life<0){
        //this.isAlive = false;
    }
};
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = DamageCalculator;
}