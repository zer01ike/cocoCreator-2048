var Global=require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        cardPre:{
            default:null,
            type:cc.Prefab
        },
        cardBg:{
            default:null,
            type:cc.Node
        },
        scoreBg:{
            default:null,
            type:cc.Node
        },
        score_label:{
            default:null,
            type:cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        // TODO:添加触摸事件
        
        //注册键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.TouchManger();

        //关闭边缘模糊
        cc.view.enableAntiAlias(false);

        // 初始化场景
        this.initGameScene();

        //设置全局卡片的大小
        Global.card_size=cc.winSize.width/4;

        //开始游戏输出两个卡片
        this.initdrawcard();

        //testing for card_location
        // for(var col=0;col<4;col++){
        //     for(var row =0;row<4;row++){
        //         this.drawSingleCard(1024,col,row);
        //     }
        // }
    },

    initGameScene:function(){
        //define the center of the gameboard 
        //需要保证竖屏玩耍，未做横屏适配
        //以后的card的位置均以gameboard为中心算出

        //定义分数面板的大小和位置
        this.scoreBg.width=cc.winSize.width;
        this.scoreBg.height=cc.winSize.height-cc.winSize.width;

        //定义游戏面板的大小和位置
        this.cardBg.width=cc.winSize.width;
        this.cardBg.height=this.cardBg.width;
        this.cardBg.color=new cc.Color(187,173,161);

    },

    //在指定的16宫格的位置上画一个方块，并给定其要显示的数字num
    drawSingleCard: function(num,col,row){
        var singlecard = cc.instantiate(this.cardPre);
        this.cardBg.addChild(singlecard);
        var size = Global.card_size;
        singlecard.width=size-3;
        singlecard.height=size-3;
        //test
        var temp_postion_x=(col-3/2)*size;
        var temp_postion_y=(row-3/2)*size;
        singlecard.setPosition(temp_postion_x,temp_postion_y);
        singlecard.getComponent("Card").numLabel.string=num;
        Global.cards[col][row]=num;
        Global.cardsEntity[col][row]=singlecard;
        this.cardColor(col,row);
        //Global.cardsEntity[col][row].getComponent("Card").numLabel.string=5;
    },

    initdrawcard: function(){
        //删除所有数组中的值的全局所存储的值
        this.score_label.string=0;
        for(var col =0;col<4;col++){
            for(var row =0 ;row<4;row++){
                Global.cards[col][row]=0;
                if(Global.cardsEntity[col][row]!=null){
                    Global.cardsEntity[col][row].destroy();
                }
                Global.cardsEntity[col][row]=null;
            }
        }

        Global.score=0;

        this.randomCard();
        this.randomCard();
    },

    randomCard :function(){
        //根据global的内容生成随机位置的数，默认生成num=2;
        var col=0;
        var row=0;
        if(!this.isFull()){
            while(true){
                col=Math.floor(Math.random()*4);
                row=Math.floor(Math.random()*4);

                //console.log("col="+col+"   row="+row);
                if(Global.cards[col][row]==0) {
                    Global.cards[col][row]=2;
                    this.drawSingleCard(2,col,row);
                    break;
                }
            }
        }
        
    },

    isFull:function(){
        //判断card表是不是已满
        for(var col=0;col<4;col++){
            for(var row =0 ;row <4 ; row++){
                if(Global.cards[col][row]==0) return false;
            }
        }

        return true;
    },

    move:function(type){
        //分为多个动作，1.移动方向上可直线相连的合并，2.同方向为空则位移
        //当前节点为空，则往后探测到不空的，然后平移过来并更新值
        //当前节点不空，探测下一个是否与之相同
        //不相同则不做处理
        //相同则合并，即将num相加，当前位置的card销毁。
        var ismove=false;
        switch(type){
            //up
            case 0:
                for(var col=0;col<4;col++){
                    for(var row=3;row>=0;row--){
                        for(var row_temp=row-1;row_temp>=0;row_temp--){
                            var col_temp=col;
                            var current=Global.cards[col][row];
                            var next=Global.cards[col_temp][row_temp];
                            if(next>0){
                                if(current==0){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    row++;
                                    ismove=true;    
                                }else if (current==next){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    ismove=true;
                                }
                                break;
                            }
                        }
                    }
                }
                
                break;
            //down
            case 1:
                for(var col=0;col<4;col++){
                    for(var row=0;row<4;row++){
                        for(var row_temp=row+1;row_temp<4;row_temp++){
                            var col_temp=col;
                            var current=Global.cards[col][row];
                            var next=Global.cards[col_temp][row_temp];
                            if(next>0){
                                if(current==0){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    row--;
                                    ismove=true;    
                                }else if (current==next){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    ismove=true;
                                }
                                break;
                            }
                        }
                    }
                }
                break;
            //left
            case 2:
                for(var row=0;row<4;row++){
                    for(var col=0;col<4;col++){
                        for(var col_temp=col+1;col_temp<=3;col_temp++){
                            var row_temp=row;
                            var current=Global.cards[col][row];
                            var next=Global.cards[col_temp][row_temp];
                            if(next>0){
                                if(current==0){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    col--;
                                    ismove=true;    
                                }else if (current==next){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    ismove=true;
                                }
                                break;
                            }
                        }
                    }
                }
                break;
            //right
            case 3:
                for (var row=0;row<4;row++){
                    for(var col=3;col>=0;col--){
                        for(var col_temp=col-1;col_temp>=0;col_temp--){
                            var row_temp=row;
                            var current=Global.cards[col][row];
                            var next=Global.cards[col_temp][row_temp];
                            if(next>0){
                                if(current==0){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    col++; 
                                    ismove=true;   
                                }else if (current==next){
                                    this.moveDraw(col,row,col_temp,row_temp);
                                    ismove=true;
                                }
                                break;
                            }
                        }
                    }
                }
                break;
        }

        return ismove;

    },

    moveDraw: function(col,row,col_temp,row_temp){
        //先将num转移
        Global.cards[col][row]+=Global.cards[col_temp][row_temp];
        Global.cards[col_temp][row_temp]=0;
        //card转移

        if(Global.cardsEntity[col][row]==null){
            //Global.cardsEntity[col][row]=Global.cardsEntity[col_temp][row_temp];
            this.drawSingleCard(Global.cards[col][row],col,row);
        }
        Global.cardsEntity[col_temp][row_temp].destroy();
        Global.cardsEntity[col_temp][row_temp]=null;
        //设置Card的相关属性
        //设置显示字符
        Global.cardsEntity[col][row].getComponent("Card").numLabel.string=Global.cards[col][row];
        this.cardColor(col,row);
    },

    moveCard:function(num){
        if(this.move(num)){
            this.randomCard();
            this.calculateScore();
            if(this.isFull()){
                //弹出结束界面
                //统计得分
                cc.director.loadScene("EndScene");
            }
        }
    },

    cardColor: function(col,row){
        //改变位置所指定的卡片的颜色
        var num = Global.cards[col][row];
        if(num==0){
            return null;
        }else{
            Global.cardsEntity[col][row].color=Global.colors[num];
        }
        
    },

    calculateScore:function(){
        var temp_score=0;
        for(var col=0;col<4;col++){
            for(var row=0;row<4;row++){
                var num= Global.cards[col][row];
                if(num>0) temp_score+=num*2-4;
            }
        }
        //计算完分数显示在label上
        Global.score=temp_score;
        this.score_label.string=Global.score;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // 键盘事件处理函数集合
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.up:
                this.moveCard(0);
                break;
            case cc.KEY.down:
                this.moveCard(1);
                break;
            case cc.KEY.left:
                this.moveCard(2);
                break;
            case cc.KEY.right:
                this.moveCard(3);
                break;
        }
    },

    onKeyUp: function (event) {
        // switch(event.keyCode) {
        //     case cc.KEY.up:
        //         console.log('release a key');
        //         break;
        // }
    },

    //触摸事件处理集合

    //开启触摸事件管理
    TouchManger:function(){
        this.cardBg.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.cardBg.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    },

    onTouchStart:function(event){
        this.startLoaction=event.getLocation();
        console.log("s->"+this.startLoaction.x);
    },

    onTouchEnd:function(event){
        this.endLocation=event.getLocation();
        console.log("e->"+this.endLocation.x);

        //计算方向
        var offset_x=this.startLoaction.x-this.endLocation.x;
        var offset_y=this.startLoaction.y-this.endLocation.y;

        if(Math.abs(offset_x)>Math.abs(offset_y)){
            if(offset_x>0){
                //手指左移
                this.moveCard(2);
            }else{
                //手指右移
                this.moveCard(3);
            }
        }else{
            if(offset_y>0){
                //手指下移
                this.moveCard(1);
            }else{
                //手指上移
                this.moveCard(0);
            }
        }
    }

});
