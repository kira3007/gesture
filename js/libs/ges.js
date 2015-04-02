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

        autoStart : true,

        lazyDistance : 3
    };

    var lisen = false;
    var drag = false;

    //辅助判断拖拽是否发生
    var moved = {
        status : false,
        dis : 3,
        startPos : -1,
        reset : function(){
            this.startPos = -1; 
            this.status = false;
        },
        setStart: function(pos){
            this.startPos = pos; 
            this.status = false;
        },

        setStatus : function(pos){
            if(this.startPos == -1){
                throw new Error("moved.startPos 没有初始化");
            }

            var d = {x : pos.x - this.startPos.x, y : pos.y - this.startPos.y};
            var dd = Math.sqrt(d.x*d.x + d.y*d.y);
            return this.status = dd >= this.dis;
        }
    };

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
        $.each("start move end doubleClick rightClick".split(" "),function(_,evt){
            _this.callbacks[evt] = $.Callbacks();

            _this["on" + evt] = function(func){
                _this.callbacks[evt].add(func);
                return _this; 
            };
        });

        moved.dis = this.lazyDistance;
    };

    $.extend(Ges.prototype,{
        _fire : function(evt){
            var event = evt;
            console.log(event);
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
            .bind('contextmenu',function(e){
                e.preventDefault();
                _this._fire('rightClick','');
            })
            .bind('dblclick',function(e){
                _this._fire('doubleClick',''); 
            })
            .bind('mousedown.ges',function(e){
                //todo right mouse down?
                if(e.button == 2) return;

                drag = true; 
                moved.setStart(_this._getPos(e));
                //_this._fire('start', _this._getPos(e));
            })
            .bind('mousemove.ges',function(e){
                if(!drag) return; 

                var pos = _this._getPos(e);
                if(!moved.status){
                    //is moved ?
                    if(moved.setStatus(pos)){
                        _this._fire('start', moved.startPos);
                    }else{
                        return; 
                    }
                }

                _this._fire('move', pos);
            })
            .bind('mouseup.ges mouseout.ges',function(e){
                //有移动过
                if(moved.status){
                    _this._fire('end', _this._getPos(e));
                }

                drag = false; 
                moved.reset();
            })
            .bind('mouseout.ges',function(e){
                //if(e.relatedTarget && "HTML" == e.relatedTarget.nodeName && drag){
                //}
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
