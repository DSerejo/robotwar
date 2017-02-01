var TestScenes = {
    'simple_rubber_block': {
        bodies:[
            {
                position: new b2Vec2(10, 5),
                width: 1,
                height: 1,
                type: b2_dynamicBody,
                angle: 0,
                'class': 'box',
                id:'1',
                'material': 'rubber'
            }
        ],
        joints:[]
    },
    'simple_rubber_block2': {
        bodies:[
            {
                position: new b2Vec2(10, 5),
                width: 1,
                height: 1,
                type: b2_dynamicBody,
                angle: 0,
                'class': 'box',
                id:'1',
                'material': 'wood'
            },
            {
                position: new b2Vec2(10.5, 5),
                width: 1,
                height: 1,
                type: b2_dynamicBody,
                angle: 0,
                'class': 'box',
                id:'2',
                'material': 'rubber'
            }
        ],
        joints:[
            {
                position: new b2Vec2(10.375,5),
                bodyAId: '1',
                bodyBId: '2',
                class:'pin',
                'id':'3'
            }
        ]
    },
    //'impact_free_fall_test':[
    //    {position:cc.p(200,400),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.metal()},
    //    {position:cc.p(300,400),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.wood()},
    //    {position:cc.p(400,400),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.rubber()}
    //],
    //'impact_steel_on_wood':[
    //    {position:cc.p(200,255),width:50,height:50,type:b2_dynamicBody,angle:30,'class':'box',id:'2','material':Materials.metal()},
    //    {position:cc.p(200,30),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.rubber()}
    //],
    //'impact_steel_on_rubber':[
    //    {position:cc.p(200,55),width:200,height:100,type:b2_dynamicBody,angle:2,'class':'box',id:'2','material':Materials.metal()},
    //    {position:cc.p(200,400),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.rubber()}
    //],
    //'impact_steel_on_steel':[
    //    {position:cc.p(200,300),width:200,height:100,type:b2_dynamicBody,angle:2,'class':'box',id:'2','material':Materials.metal()},
    //    {position:cc.p(200,30),width:50,height:50,type:b2_dynamicBody,angle:0,'class':'box',id:'2','material':Materials.metal()}
    //],
    //'static_rotating_collision':[
    //    {position:cc.p(200,20),width:300,height:30,type:b2_dynamicBody,angle:0,'class':'box',id:'1'},
    //    {position:cc.p(200,55),width:50,height:70,type:b2_dynamicBody,angle:0,'class':'box',id:'2'},
    //    {position:cc.p(180,25),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(220,25),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(220,85),width:50,height:50,type:b2_dynamicBody,angle:45,'class':'box',id:'3'},
    //    {position:cc.p(220,85),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(300,400),width:50,height:50,angle:5,type:b2_dynamicBody,'class':'box',id:'4','material':Materials.metal()}
    //],
    //'landing_ship':[
    //    {position:cc.p(200,100),width:200,height:150,type:b2_dynamicBody,angle:0,'class':'box',id:'1','material':Materials.metal()},
    //    {position:cc.p(125,150),type:b2_dynamicBody,angle:-30,'class':'propulsor','action_keys':{start:68},force:25},
    //    {position:cc.p(115,155),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(130,145),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(275,150),type:b2_dynamicBody,angle:30,'class':'propulsor','action_keys':{start:65},force:25},
    //    {position:cc.p(265,145),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(285,155),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(275,33),type:b2_dynamicBody,angle:0,'class':'propulsor','action_keys':{start:87},force:300},
    //    {position:cc.p(125,33),type:b2_dynamicBody,angle:0,'class':'propulsor','action_keys':{start:87},force:300},
    //    {position:cc.p(115,33),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(135,33),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(265,33),type:b2_dynamicBody,radius:5,'class':'pin'},
    //    {position:cc.p(285,33),type:b2_dynamicBody,radius:5,'class':'pin'},
    //]
};
TestScenes.running = TestScenes.simple_rubber_block2;
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    module.exports = TestScenes;
}
