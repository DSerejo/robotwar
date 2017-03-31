'use strict';
class Material{
    fixtureOptions(){
        return {
            density:this.density,
            friction:this.friction,
            restitution:this.restitution,
            fillColor:this.fillColor,
        }
    }
    getFakePlasticDeformationModulus(){
        return this.fakeYoungModulus*0.2
    }
    /**
     * Calculates the fake deformation ratio for a given stress per area
     * being 0 = elastic deformation and 1 = fracture
     * @param  {Number} stressPerArea
     * @return {Number}
     */
    calculateDeformationRatio(stressPerArea){
        var deformation,
            deformationStress;

        if(stressPerArea<this.fakeYieldStrength)
            return 0;
        deformationStress = stressPerArea - this.fakeYieldStrength;
        deformation = stressPerArea * this.getFakePlasticDeformationModulus();
        return deformation/this.fakeFractionStrain;
    }
    /**
     * Calculates the imaginary energy absorbed
     * being 0 = elastic deformation and 1 = fracture
     * @param  {Number} energyPerArea
     * @return {Number}
     */
    calculateAbsorbedEnergy(energyPerArea){
        return energyPerArea*this.imaginaryEnergyAbsorptionRate;
    }

}
Material.prototype.init = function(){
    _.extend(this,{})
};

class Rubber extends Material{};
Rubber.prototype.name = 'rubber';
Rubber.prototype.density = 1.2;
Rubber.prototype.friction = 1;
Rubber.prototype.restitution = 1;
Rubber.prototype.fillColor = '#000000';
Rubber.prototype.fakeYoungModulus = 0.2;
Rubber.prototype.fakeYieldStrength = 2500;
Rubber.prototype.fakeFractionStrain = 2500;
Rubber.prototype.imaginaryEnergyAbsorptionRate = 1;

class Metal extends Material{}
Metal.prototype.name = 'metal';
Metal.prototype.density = 7;
Metal.prototype.friction = 1;
Metal.prototype.restitution = 0.3;
Metal.prototype.fillColor = '#EFEFEF';
Metal.prototype.fakeYoungModulus = 0.7;
Metal.prototype.fakeYieldStrength = 2500;
Metal.prototype.fakeFractionStrain = 2500;
Metal.prototype.imaginaryEnergyAbsorptionRate = 1;


class Wood extends Material{}
Wood.prototype.name = 'wood';
Wood.prototype.density = 0.3;
Wood.prototype.friction = 0.6;
Wood.prototype.restitution = 0.2;
Wood.prototype.fillColor = '#967a1f';
Wood.prototype.fakeYoungModulus = 1;
Wood.prototype.fakeYieldStrength = 500;
Wood.prototype.fakeFractionStrain = 500;
Wood.prototype.imaginaryEnergyAbsorptionRate  = 1;

class Ground extends Material{}
Ground.prototype.name = 'ground';
Ground.prototype.density = 1;
Ground.prototype.friction = 1;
Ground.prototype.restitution = 1;
Ground.prototype.fillColor = '#5f8e6b';



var Materials = {
    rubber:function(){return new Rubber()},
    metal:function(){return new Metal()},
    wood:function(){return new Wood()},
    ground:function(){return new Ground()},
    default:'wood'
};

export default Materials;