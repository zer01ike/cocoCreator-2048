
var cards_map=[
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];

var cards_entity=[
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
];

module.exports = {
    score: 0,
    card_size:0,
    cards:cards_map,
    cardsEntity:cards_entity,
    level1:new cc.color(217,202,184,255),
    level2:new cc.color(191,177,159,255),
    level3:new cc.color(166,133,104,255),
    level4:new cc.color(115,86,69,255),
    level5:new cc.color(64,40,32,255),
    level6:new cc.color(115,100,56,255),
    level7:new cc.color(140,89,70,255),
    level8:new cc.color(115,56,50,255),
    level9:new cc.color(115,32,32,255),
    level10:new cc.color(115,103,88,255),
    level11:new cc.color(255,0,0),
    level12:new cc.color(0,0,0),
    level13:new cc.color(0,255,0)
};
