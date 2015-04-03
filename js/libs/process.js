/*
 * resize convert to small size
 *
 * toString
 *
 * send send to server
 *
 * event:onresult onfail
 * */
define(function(require){
    var cfg = {
        //服务器地址
        server : null,

        //(x,y)之间的分隔符
        xySeparator : 'a',

        //坐标之间分隔符
        pointSeparator : 'a',

        //笔画之间的分隔符
        pathSeparator : 'aa'
    };
    
    var Process = function(opt){
        $.extend(this, cfg, opt); 

        this.resultCallbacks = $.Callbacks();
        this.onresult = function(func){
            this.resultCallbacks.add(func); 
        };

        this.wd = null;
    };



    $.extend(Process.prototype, {

        /*
         * 发送数据到服务器
         * 成功返回结果，触发result事件
         * 失败，触发fail事件
         * send 通过手写的数据
         * */
        send : function(data){
            var _this = this;
            var toSend = {type : 1, wd : _this.convert(data)};
            this.wd = toSend.wd;
            this._sendData(toSend); 
        },

        //联想单词
        image : function(word){
            if(word === undefined) return;
            var _this = this;
            //word 编码 
            var encodeWord = (escape(word).split("%u"))[1];
            //console.log(encodeWord);
            this._sendData({
                //stk : _this.wd,//貌似可以不用发
                type : 2,
                wd : encodeWord
            });
        },

        _sendData : function(data){
            var _this = this;
            var ajax=$.ajax({
                    url:_this.server,
                    cache:false,
                    contentType:"text/html;charset=gb2312",
                    dataType:"json",
                    data:data,
                    success : function(res){
                        //结果为空
                        //if(res && res.s == "") return;

                        _this.resultCallbacks.fire(res); 
                    },
                    type:'post'
                });
        },

        //将笔画数据，转换为字符串
        convert : function(data){
            var str = [], _this = this;
            $.each(data,function(_,path){
                path = $.map(path,function(point){
                    return point.x + _this.xySeparator + point.y; 
                }); 

                str.push(path.join(_this.pointSeparator));
            });

            return str.join(_this.pathSeparator);
        }
    });

    return Process;
});
