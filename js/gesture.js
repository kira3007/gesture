define(function(require){

    var Ges = require("./libs/ges");
    var Panel = require("./libs/panel");
    var Process = require("./libs/process");
    var Result = require("./libs/result");

    var cfg = {
        
        //父容器 
        container : 'body',

        panelWidth : 450,

        panelHeight : 450,

        autoConfirmWaitTime : 3000,

        penSize : 3,

        penColor : '#000',

        server : '',

        autoConfirm : true,

        twoFingerOn : false
    };

    var Gesture = function(opt){
        var _this = this;
        $.extend(this, cfg, opt); 
        
        //数据处理器
        this.process = new Process({
            server : _this.server 
        });

        this.result = new Result({
            container : _this.container,
            autoConfirm : _this.autoConfirm,
            waitTime : _this.autoConfirmWaitTime
        });

        this.process.onresult(function(res){
            _this.result.show(res); 
        });

        //画板
        this.panel = new Panel({
            container : _this.container,
            width : _this.panelWidth,
            height : _this.panelHeight,
            lineWidth : _this.penSize,
            color : _this.penColor
        });

        //鼠标、手势监视器
        this.ges = new Ges({
            target : _this.panel.node 
        });

        this.ges.onstart(function(pos){
            _this.panel.moveTo(pos);
        }).onmove(function(pos){
            _this.panel.lineTo(pos); 
        }).onend(function(pos){
            _this.panel.endPath(pos); 

            //发送所有的笔画数据
            _this.process.send(_this.panel.getData());
        });
    };

    return Gesture;
});
