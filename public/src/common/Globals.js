var _p = typeof window !== 'undefined'?window:global;
_p.UPDATE_PMR = function(){
    PMR = PMR_START*WORLD_SCALE
};
_p.b2Vec2 = Box2D.Common.Math.b2Vec2;
_p.b2BodyDef = Box2D.Dynamics.b2BodyDef;
_p.b2Body = Box2D.Dynamics.b2Body;
_p.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
_p.b2World = Box2D.Dynamics.b2World;
_p.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
_p.b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;
_p.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
_p.b2_staticBody = Box2D.Dynamics.b2Body.b2_staticBody;
_p.b2_dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
_p.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
_p.b2ContactListener = Box2D.Dynamics.b2ContactListener
_p.b2Mat22 = Box2D.Common.Math.b2Mat22;
_p.b2Mat33 = Box2D.Common.Math.b2Mat33;
_p.b2Math = Box2D.Common.Math.b2Math;
_p.b2Sweep = Box2D.Common.Math.b2Sweep;
_p.b2Transform = Box2D.Common.Math.b2Transform;
_p.b2Vec2 = Box2D.Common.Math.b2Vec2;
_p.b2Vec3 = Box2D.Common.Math.b2Vec3;
_p.b2Color = Box2D.Common.b2Color;
_p.b2internal = Box2D.Common.b2internal;
_p.b2Settings = Box2D.Common.b2Settings;
_p.b2AABB = Box2D.Collision.b2AABB;
_p.b2Bound = Box2D.Collision.b2Bound;
_p.b2BoundValues = Box2D.Collision.b2BoundValues;
_p.b2Collision = Box2D.Collision.b2Collision;
_p.b2ContactID = Box2D.Collision.b2ContactID;
_p.b2ContactPoint = Box2D.Collision.b2ContactPoint;
_p.b2Distance = Box2D.Collision.b2Distance;
_p.b2DistanceInput = Box2D.Collision.b2DistanceInput;
_p.b2DistanceOutput = Box2D.Collision.b2DistanceOutput;
_p.b2DistanceProxy = Box2D.Collision.b2DistanceProxy;
_p.b2DynamicTree = Box2D.Collision.b2DynamicTree;
_p.b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase;
_p.b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode;
_p.b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair;
_p.b2Manifold = Box2D.Collision.b2Manifold;
_p.b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint;
_p.b2Point = Box2D.Collision.b2Point;
_p.b2RayCastInput = Box2D.Collision.b2RayCastInput;
_p.b2RayCastOutput = Box2D.Collision.b2RayCastOutput;
_p.b2Segment = Box2D.Collision.b2Segment;
_p.b2SeparationFunction = Box2D.Collision.b2SeparationFunction;
_p.b2Simplex = Box2D.Collision.b2Simplex;
_p.b2SimplexCache = Box2D.Collision.b2SimplexCache;
_p.b2SimplexVertex = Box2D.Collision.b2SimplexVertex;
_p.b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact;
_p.b2TOIInput = Box2D.Collision.b2TOIInput;
_p.b2WorldManifold = Box2D.Collision.b2WorldManifold;
_p.ClipVertex = Box2D.Collision.ClipVertex;
_p.Features = Box2D.Collision.Features;
_p.IBroadPhase = Box2D.Collision.IBroadPhase;
_p.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
_p.b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef;
_p.b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;
_p.b2MassData = Box2D.Collision.Shapes.b2MassData;
_p.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
_p.b2Shape = Box2D.Collision.Shapes.b2Shape;
_p.b2Body = Box2D.Dynamics.b2Body;
_p.b2BodyDef = Box2D.Dynamics.b2BodyDef;
_p.b2ContactFilter = Box2D.Dynamics.b2ContactFilter;
_p.b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse;
_p.b2ContactListener = Box2D.Dynamics.b2ContactListener;
_p.b2ContactManager = Box2D.Dynamics.b2ContactManager;
_p.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
_p.b2DestructionListener = Box2D.Dynamics.b2DestructionListener;
_p.b2FilterData = Box2D.Dynamics.b2FilterData;
_p.b2Fixture = Box2D.Dynamics.b2Fixture;
_p.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
_p.b2Island = Box2D.Dynamics.b2Island;
_p.b2TimeStep = Box2D.Dynamics.b2TimeStep;
_p.b2World = Box2D.Dynamics.b2World;
_p.b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact;
_p.b2Contact = Box2D.Dynamics.Contacts.b2Contact;
_p.b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint;
_p.b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint;
_p.b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge;
_p.b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory;
_p.b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister;
_p.b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult;
_p.b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver;
_p.b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact;
_p.b2NullContact = Box2D.Dynamics.Contacts.b2NullContact;
_p.b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact;
_p.b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact;
_p.b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact;
_p.b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold;
_p.b2Controller = Box2D.Dynamics.Controllers.b2Controller;
_p.b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
_p.b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
_p.b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint;
_p.b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;
_p.b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint;
_p.b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;
_p.b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian;
_p.b2Joint = Box2D.Dynamics.Joints.b2Joint;
_p.b2JointDef = Box2D.Dynamics.Joints.b2JointDef;
_p.b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge;
_p.b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint;
_p.b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
_p.b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;
_p.b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
_p.b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
_p.b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
_p.b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint;
_p.b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
_p.b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
_p.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
_p.b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint;
_p.b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
_p.PMR_START = 40;
_p.WORLD_SCALE = 1;
_p.PMR = PMR_START*WORLD_SCALE;
_p.gravity = new b2Vec2(0,-10);
_p.RESOLUTION = {width:800,height:400};
_p.xport = 82;
_p.xhost = '10.0.0.34';
_p.MODE = 'server1';



