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
                            '<canvas class="panel" width="'+this.width+'" height="'+this.height+'"/></div>'
                         ).appendTo(this.container); 
            this.bg = $('<div class="gesture-bg"><p>中</p><canvas class="canvas-bg" width="'+this.width+'" height="'+this.height+'"/></div>').prependTo(this.node);

            this.placeholder = this.bg.find('p');
            this.$canvas = $(this.container).find('.panel');
            this.canvas = this.$canvas[0];

            this.bgCanvas = $(this.bg).find('.canvas-bg')[0];

            if (!document.createElement('canvas').getContext) {
                var excanvas = require('./../plugins/canvas3.0');
                excanvas && excanvas.init && excanvas.init([this.canvas,this.bgCanvas]); 
            }

            this.addDottedLine(this.bgCanvas);
            this.context = this.canvas.getContext('2d');
            //set line width
            this.context.lineWidth = this.lineWidth;

            //set line color
            this.context.strokeStyle = this.color;

            this.context.lineCap = "round";
            //1xp bug
            //this.context.translate(0.5, 0.5);
        },

        hidePlaceholder : function(){
            this.placeholder.hide(); 
        },

        showPlaceholder : function(){
            this.placeholder.show(); 
        },

        addDottedLine : function(canvas){
            var _this = this;
            var ctx = canvas.getContext('2d');
            //1xp bug
            //ctx.translate(0.5, 0.5);
            ctx.lineWidth = 1;
            ctx.strokeStyle= '#f0f0f0';

            var cntX = canvas.width/2;
            var cntY = canvas.height/2;

            //单位坐标，相对于中心点
            points = [
                {x:-1,y:-1},
                {x:0,y:-1},
                {x:1,y:-1},
                {x:1,y:0}
            ];
            
            $.each(points,function(_,p){
                var from = {x:cntX * p.x + cntX, y:cntY * p.y + cntY};
                var to = {x:- cntX * p.x + cntX, y:- cntY * p.y + cntY};
                _this.drawDottedLine(from,to,canvas);
            });  
        },
    
        drawDottedLine : function(from, to,canvas){
            var ctx = canvas.getContext('2d');
            var count = 100,i=true;
            ctx.beginPath();

            var dx = to.x - from.x;
            var dy = to.y - from.y;

            var ddx = dx / count;
            var ddy = dy / count;

            var startX = from.x, startY = from.y;
            while( dx * (to.x - startX) >=0 && dy * (to.y - startY) >= 0){
               if(i){
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(startX + ddx,startY + ddy);
                    ctx.stroke();
                }
                startX += ddx; 
                startY += ddy;
                i = !i;
            }
            ctx.closePath();
        },

        lineTo : function(x, y){
            this.hidePlaceholder();
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
            this.showPlaceholder();
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
