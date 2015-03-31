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
    };



    $.extend(Process.prototype, {

        /*
         * 发送数据到服务器
         * 成功返回结果，触发result事件
         * 失败，触发fail事件
         * */
        send : function(data){
            var _this = this;
            var toSend = {type : 1, wd : _this.convert(data)};

            var ajax=$.ajax({
                    url:_this.server,
                    cache:false,
                    contentType:"text/html;charset=gb2312",
                    dataType:"json",
                    data:toSend,
                    success : function(res){
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
