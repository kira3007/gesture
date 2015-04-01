/*
 * result.clear
 *
 * result.undo
 *
 * result.show
 *
 * result.onresult
 *
 * result.onundo
 *
 * result.onclear
 * */

define(function(require){
    var cfg = {
        container : null,

        //是否自动选择第一个词
        //自动选择，不触发联想
        autoConfirm : true,

        //自动选择等待时间
        waitTime : 1000
    };

    var Result = function(opt){
        var _this = this;
        $.extend(this, cfg, opt); 

        this.cur_result = null;
        //记录上一次的结果
        //be used in undo
        this.pre_result = null;

        //自动确认等待定时器
        this.timer = null;

        this.callbacks = {};
        $.each("result image clear undo".split(" "), function(_, e){
            _this.callbacks[e] = $.Callbacks();

            _this["on" + e] = function(func){
                _this.callbacks[e].add(func);
                return _this;
            };
        });

        this.init();
    };

    $.extend(Result.prototype, {
        init : function(){
            var _this = this;
            //当前词是否进行过联想
            this.imaged = false;

            this.$node = $('<div class="gesture-result"><div class="words"></div><div class="btns">'+
                                '<a href="javascript:void(0);" class="undo">撤销</a>'+ 
                                '<a href="javascript:void(0);" class="clear">重写</a>'+ 
                             '</div></div>').appendTo(this.container); 

            $.each("words undo clear".split(" "),function(_, name){
                _this["$" + name] = _this.$node.find('.' + name);
            });

            this.$words.delegate('a','click',function(){
                _this.select(_this.$words.find('a').index($(this)));
                //console.log(this.innerHTML); 
            });

            this.$undo.click(function(){
                _this.undo(); 
            });

            this.$clear.click(function(){
                _this.clear(); 
            });
        },

        //开始一个新的词，设置联想开启
        setImage : function(){
            this.imaged = false; 
        },

        updateResult : function(result){
            var html = '';
            if(result && !result.s) return;

            if(result && result.s){
                //取前10个
                $.each(result.s.split("").slice(0,10),function(_, word){
                    html += '<a href="javascript:void(0);">'+word+'</a>'; 
                }); 
            }

            this.$words.html(html);
            return this;
        },

        show : function(result){
            var _this = this;
            this.pre_result = this.cur_result;
            this.cur_result = result; 
            this.updateResult(result);

            //如果不自动确认
            if(!this.autoConfirm) return;

            if(this.timer){
                clearTimeout(this.timer); 
                this.timer = null;
            }

            //已经联想过
            if(this.imaged) return;

            this.timer = setTimeout(function(){
                _this.select(); 
            },this.waitTime);
        },

        //返回第n个字
        //触发onresult 事件
        select : function(index){
            index = index || 0; 
            var word = this.$words.find('a').eq(index).html();
            this.callbacks['result'].fire(word); 

            //联想
            if(!this.imaged){
                this.callbacks["image"].fire(word);
                this.imaged = true;
            }
        },

        clear : function(){
            this.updateResult();
            this.callbacks['clear'].fire(); 
        },

        undo : function(){
            this.updateResult(this.pre_result);
            this.imaged = false;
            this.callbacks['undo'].fire(); 
        }
    });

    return Result;
});
