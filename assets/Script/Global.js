
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

var color_level=[];

color_level[2]=new cc.color(238,228,219);
color_level[4]=new cc.color(232,220,197);
color_level[8]=new cc.color(241,177,125);
color_level[16]=new cc.color(243,149,104);
color_level[32]=new cc.color(244,124,99);
color_level[64]=new cc.color(244,95,67);
color_level[128]=new cc.color(236,106,120);
color_level[256]=new cc.color(236,203,105);
color_level[512]=new cc.color(236,199,90);
color_level[1024]=new cc.color(236,196,76);
color_level[2048]=new cc.color(255,0,0);
color_level[4096]=new cc.color(0,0,0);
color_level[8192]=new cc.color(0,255,0);


module.exports = {
    score: 0,
    card_size:0,
    cards:cards_map,
    cardsEntity:cards_entity,
    colors:color_level,
};
