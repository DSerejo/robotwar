var Material = function(){};
Material.prototype.init = function(){
    _.extend(this,{
        fixtureOptions: function(){
            return {
                density:this.density,
                friction:this.friction,
                restitution:this.restitution,
                fillColor:this.fillColor,
            }
        },
        getFakePlasticDefModulus:function(){
            return this.fakeYoungModulus*0.2
        },
        /**
         * Calculates the fake deformation ratio for a given absorbed energy per area
         * being 0 = elastic deformation and 1 = fracture
         * @param  {Number} absorbedEnergyPerArea
         * @return {Number}
         */
        calculateDeformationRatio:function(absorbedEnergyPerArea){
            var deformationEnergy,
                deformation;
            if(absorbedEnergyPerArea<this.fakeYieldStrength)
                return 0;
            deformationEnergy = absorbedEnergyPerArea - this.fakeYieldStrength;
            deformation = deformationEnergy * this.getFakePlasticDefModulus();

            //return Math.min(deformation/this.fakeFractionStrain,1);
            return deformation/this.fakeFractionStrain;
        },
        /**
         * Calculates the imaginary energy absorbed
         * being 0 = elastic deformation and 1 = fracture
         * @param  {Number} energyPerArea
         * @return {Number}
         */
        calculateAbsorbedEnergy:function(energyPerArea){
            return energyPerArea*this.imaginaryEnergyAbsorptionRate;
        }

    })
};

var Rubber = function(){};
Box2D.inherit(Rubber,Material);
Rubber.prototype.name = 'rubber';
Rubber.prototype.density = 1.2;
Rubber.prototype.friction = 1;
Rubber.prototype.restitution = 1;
Rubber.prototype.fillColor = '#000000';
Rubber.prototype.fakeYoungModulus = 0.2;
Rubber.prototype.fakeYieldStrength = 250;
Rubber.prototype.fakeFractionStrain = 125;
Rubber.prototype.imaginaryEnergyAbsorptionRate = 1;


var Steel = function(){};
Box2D.inherit(Steel,Material);
Steel.prototype.name = 'steel';
Steel.prototype.density = 7;
Steel.prototype.friction = 0.3;
Steel.prototype.restitution = 0.3;
Steel.prototype.fillColor = '#EFEFEF';
Steel.prototype.fakeYoungModulus = 0.7;
Steel.prototype.fakeYieldStrength = 400;
Steel.prototype.fakeFractionStrain = 200;
Steel.prototype.imaginaryEnergyAbsorptionRate = 1;


var Wood = function(){};
Box2D.inherit(Wood,Material);
Wood.prototype.name = 'wood';
Wood.prototype.density = 0.3;
Wood.prototype.friction = 0.6;
Wood.prototype.restitution = 0.2;
Wood.prototype.fillColor = '#967a1f';
Wood.prototype.fakeYoungModulus = 1;
Wood.prototype.fakeYieldStrength = 40;
Wood.prototype.fakeFractionStrain = 20;
Wood.prototype.imaginaryEnergyAbsorptionRate  = 1;


var Materials = {
    rubber:function(){return new Rubber()},
    metal:function(){return new Steel()},
    wood:function(){return new Wood()},
    default:'wood'
};

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Materials;
}