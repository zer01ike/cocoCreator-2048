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
        gameboard_x:0,
        gameboard_y:0,
    },

    // use this for initialization
    onLoad: function () {

        //注册键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        //define the center of the gameboard 
        //需要保证竖屏玩耍，未做横屏适配
        //以后的card的位置均以gameboard为中心算出
        this.gameboard_x=0;
        this.gameboard_y=cc.winSize.width/2-cc.winSize.height/2;

        this.scoreBg.width=cc.winSize.width;
        this.scoreBg.height=this.scoreBg.width/4;
        this.scoreBg.setPosition(0,cc.winSize.height/2-this.scoreBg.height/2);

        // console.log("winsize.w="+cc.winSize.width+"  winsize.h="+cc.winSize.height);
        // console.log("gameboard_x="+this.gameboard_x+"  gameboard_y="+this.gameboard_y);

        //init the game board for card!
        this.cardBg.width=cc.winSize.width;
        this.cardBg.height=this.cardBg.width;
        //this.cardBg.height=cc.winSize.height;
        this.cardBg.setPosition(this.gameboard_x,this.gameboard_y);
        //this.cardBg.setPosition(0,0);

        this.cardBg.color=new cc.Color(0,100,100);


        Global.card_size=cc.winSize.width/4;

        //this.drawSingleCard(1024,0,0);
        //this.drawSingleCard(1024,2,0);

        this.initdrawcard();

        

        console.log("end loading cards");
    },

    drawSingleCard: function(num,col,row){
        var singlecard = cc.instantiate(this.cardPre);
        var size = Global.card_size;
        singlecard.width=size-1;
        singlecard.height=size-1;
        var temp_postion_x=(this.gameboard_x-2*size)+col*size+size/2;
        var temp_postion_y=(this.gameboard_y-size)+row*size+size/2;
        singlecard.setPosition(temp_postion_x,temp_postion_y);
        singlecard.getComponent("Card").numLabel.string=num;
        Global.cards[col][row]=num;
        Global.cardsEntity[col][row]=singlecard;
        this.cardColor(col,row);
        //Global.cardsEntity[col][row].getComponent("Card").numLabel.string=5;
        this.cardBg.addChild(singlecard);
    },

    initdrawcard: function(){
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
        //设置显示位置
        // var size = Global.card_size;
        // var temp_postion_x=(this.gameboard_x-2*size)+col*size+size/2;
        // var temp_postion_y=(this.gameboard_y-size)+row*size+size/2;
        // Global.cardsEntity[col][row].setPosition(temp_postion_x,temp_postion_y);
    },

    cardColor: function(col,row){
        //改变位置所指定的卡片的颜色
        var num = Global.cards[col][row];
        var final_color=null;
        switch(num){
            case 0:
                return null;
                break;
            case 2:
                final_color=Global.level1;
                break;
            case 4:
                final_color=Global.level2;
                break;
            case 8:
                final_color=Global.level3;
                break;
            case 16:
                final_color=Global.level4;
                break;
            case 32:
                final_color=Global.level5;
                break;
            case 64:
                final_color=Global.level6;
                break;
            case 128:
                final_color=Global.level7;
                break;
            case 256:
                final_color=Global.level8;
                break;
            case 512:
                final_color=Global.level9;
                break;
            case 1024:
                final_color=Global.level10;
                break;
            case 2048:
                final_color=Global.level11;
                break;
            case 4096:
                final_color=Global.level12;
                break;
            case 8128:
                final_color=Global.level13;
                break;
        }
        Global.cardsEntity[col][row].color=final_color;
    },

    calculateScore:function(){
        for(var col=0;col<4;col++){
            for(var row=0;row<4;row++){
                var num= Global.cards[col][row];
                if(num==4){
                    Global.score+=num*2;
                }else if(num==8){
                    Global.score+=num*4;
                }else if(num==16){
                    Global.score+=num*6;
                }else if(num==32){
                    Global.score+=num*8;
                }else if(num==64){
                    Global.score+=num*9;
                }else if(num==128){
                    Global.score+=num*10;
                }else if(num==256){
                    Global.score+=num*11;
                }else if(num==512){
                    Global.score+=num*12;
                }else if(num==1024){
                    Global.score+=num*13;
                }else if(num==2048){
                    Global.score+=num*14;
                }
            }
        }

        //计算完分数显示在label上
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
                if(this.move(0)){
                    this.randomCard();
                    this.calculateScore();
                    if(this.isFull()){
                        //弹出结束界面
                        //统计得分
                    }
                }
                console.log('Press up key');
                break;
            case cc.KEY.down:
                if(this.move(1)){
                    this.randomCard();
                    this.calculateScore();
                    if(this.isFull()){
                        //弹出结束界面
                        //统计得分
                    }
                }
                console.log('Press down key');
                break;
            case cc.KEY.left:
                if(this.move(2)){
                    this.randomCard();
                    this.calculateScore();
                    if(this.isFull()){
                        //弹出结束界面
                        //统计得分
                    }
                }
                console.log('Press left key');
                break;
            case cc.KEY.right:
                if(this.move(3)){
                    this.randomCard();
                    this.calculateScore();
                    if(this.isFull()){
                        //弹出结束界面
                        //统计得分
                    }
            }
                console.log('Press right key');
                break;
        }
    },

    onKeyUp: function (event) {
        // switch(event.keyCode) {
        //     case cc.KEY.up:
        //         console.log('release a key');
        //         break;
        // }
    }
});
