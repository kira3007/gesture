/*
 * var panel = new Panel();
 *
 * panel.clear
 *
 * panel.moveTo
 *
 * panel.lineTo
 *
 * panel.getData
 *
 * 
 * */
define(function(require){
    var cfg = {
        container : null,

        width : 300,

        height : 300,

        lineWidth : 3,

        color : '#000000'
    };

    var Panel = function(opt){
        $.extend(this, cfg, opt);

        var _this = this;
        //笔画
        this.strokes = [];
        //字，由笔画组成
        this.data = [];

        this.endCallbacks = $.Callbacks();
        if(this.container){
            this.init();
        }
        
        //
        this.onEndPath = function(func){
            _this.endCallbacks.add(func); 
        };
    };

    $.extend(Panel.prototype,{
        init : function(){
            this.node = $('<div class="gesture-panel" style="width:'+this.width+'px;height:'+this.height+'px">'+
                            '<canvas width="'+this.width+'" height="'+this.height+'"/></div>'
                         ).appendTo(this.container); 

            this.$canvas = $(this.container).find('canvas');
            this.canvas = this.$canvas[0];
            this.context = this.canvas.getContext('2d');
            //set line width
            this.context.lineWidth = this.lineWidth;

            //set line color
            this.context.strokeStyle = this.color;

            this.context.lineCap = "round";
            //1xp bug
            this.context.translate(0.5, 0.5);
        },

        lineTo : function(x, y){
            if(typeof x == "object"){
                y = x.y;
                x = x.x; 
            }
            this.strokes.push({x:x, y:y});

            this.context.lineTo(x, y);
            this.context.stroke();
            return this;
        },

        moveTo : function(x, y){
            if(typeof x == "object"){
                y = x.y;
                x = x.x; 
            }
            this.strokes = [];
            this.strokes.push({x:x, y:y});

            this.context.beginPath();
            this.context.moveTo(x, y); 

            return this;
        },

        endPath : function(x, y){
            if(typeof x == "object"){
                y = x.y;
                x = x.x; 
            }
            //记录这一笔画最后一个点
            this.strokes.push({x:x, y:y});
            //记录笔画
            this.data.push(this.strokes);

            this.context.closePath();

            //fire end event
            this.endCallbacks.fire(this.getData());
            return this;
        },

        clear : function(){
            this.context.clearRect(0, 0, this.width, this.height);
            this.data = [];
            this.strokes = []
            //this.data.length = this.strokes.length = 0; 

            return this;
        },

        getData : function(){
            return this.data; 
        }
    });

    return Panel;
});
