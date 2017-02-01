

var BoxBody = function(width,height,bodyType,density,restitution,friction,pos,angle,userData){
    var bodyDef = new b2BodyDef();
    bodyDef.type = bodyType;
    bodyDef.position.Set(pos.x, pos.y);
    bodyDef.angle = cc.degreesToRadians(angle);
    bodyDef.userData = userData
    this.body = World.world.CreateBody(bodyDef);
    var shape = new b2PolygonShape();
    width=width/2;
    height=height/2;
    shape.SetAsBox(width,height)
    var fixDef = new b2FixtureDef();
    fixDef.shape=shape;
    fixDef.density=density;
    fixDef.friction=friction;
    fixDef.restitution = restitution;
    this.body.CreateFixture(fixDef);
};
if (typeof require !== 'undefined' && typeof module !== 'undefined') {

    module.exports = BoxBody;
}