cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    changescene: function(event){
        cc.director.loadScene("GameScene");
        console.log('MOUSE DOWN');
    },

    // use this for initialization
    onLoad: function () {
        cc.view.enableAntiAlias(false);
        // this.label.node.on(cc.Node.EventType.MOUSE_DOWN,this._changescene,this);
        // this.label.node.on(cc.Node.EventType.TOUCH_START,this._changescene,this);
    },
    // called every frame
    // update: function (dt) {

    // },
});
