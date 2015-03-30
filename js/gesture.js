define(function(require){

    var Ges = require("./libs/ges");
    var Panel = require("./libs/panel");

    var cfg = {
        
        //父容器 
        container : 'body',

        panelWidth : 300,

        panelHeight : 300,

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
        
        this.panel = new Panel({
            container : _this.container,
            width : _this.panelWidth,
            height : _this.panelHeight,
            lineWidth : _this.penSize,
            color : _this.penColor
        });

        this.ges = new Ges({
            target : _this.panel.node 
        });

        this.ges.onstart(function(pos){
            _this.panel.moveTo(pos);
        }).onmove(function(pos){
            _this.panel.lineTo(pos); 
        }).onend(function(pos){
            _this.panel.endPath(pos); 
        });
    };

    return Gesture;
});
