cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '点击开始'
    },

    _changescene: function(event){
        cc.director.loadScene("Game");
        console.log('MOUSE DOWN');
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        cc.view.enableAntiAlias(false);
        this.label.node.on(cc.Node.EventType.MOUSE_DOWN,this._changescene,this);
    },
    // called every frame
    update: function (dt) {

    },
});
