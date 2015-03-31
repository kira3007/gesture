/*
 * var ges = new Ges();
 *
 * ges.startLisen()
 *
 * ges.stopLisen()
 *
 * ges.onStart(function(){})
 *    .onMove(function(){})
 *    .onEnd();
 *
 * 
 * */
define(function(require){
    var cfg = {
        target : 'body',

        autoStart : true
    };

    var lisen = false;
    var drag = false;

    var Ges = function(opt){
        var _this = this;
        $.extend(this, cfg, opt); 

        //jq 实例化
        this.target = $(this.target);

        //是否自动开始监听
        if(this.autoStart){
            this.startLisen(); 
        }

        //事件回调
        this.callbacks = {};
        $.each("start move end".split(" "),function(_,evt){
            _this.callbacks[evt] = $.Callbacks();

            _this["on" + evt] = function(func){
                _this.callbacks[evt].add(func);
                return _this; 
            };
        });
    };

    $.extend(Ges.prototype,{
        _fire : function(evt){
            var event = evt;
            [].shift.call(arguments);
            this.callbacks[event].fire.apply(this.callbacks[event],arguments);//fire(); 
        },

        _getPos : function(e){
            var x,y,_this = this;
            x = (e.pageX || (e.clientX + $('body').scrollLeft())) - this.target.offset().left;
            y = (e.pageY || (e.clientY + $('body').scrollTop())) - this.target.offset().top;

            return {x : parseInt(x), y : parseInt(y)};
        },

        startLisen : function(){
            if(lisen) return this;
            
            lisen = true; 
            var data = [], _this = this;
            //todo
            this.target.bind('dragstart.ges',function(e){
                e.preventDefault();
                return !1;
            })
            .bind('mousedown.ges',function(e){
                drag = true; 
                //data.push(_this._getPos(e));
                _this._fire('start', _this._getPos(e));
            })
            .bind('mousemove.ges',function(e){
                if(!drag) return; 

                _this._fire('move', _this._getPos(e));
                //data.push(_this._getPos(e));
            })
            .bind('mouseup.ges',function(e){
                drag = false; 
                _this._fire('end', _this._getPos(e));
                //data.length = 0;
            })
            .bind('mouseout.ges',function(e){
                if(e.relatedTarget && "HTML" == e.relatedTarget.nodeName && drag){
                    drag = false;
                    _this._fire('end', _this._getPos(e));
                }
            }); 

            return this;
        },

        stopLisen : function(){
            lisen = false;
            drag = false;
            this.target.unbind(".ges");
            return this;
            //todo 
        }
    });

    return Ges;
});
