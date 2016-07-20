/**
 * @author Jerry.hou
 * 
 * 提示框
 * iAlert(param);
 * 
 * 说明：
 * param = {text:'提示内容',title:'提示标题',callback:'回调方法',btext:'确认按钮文字，缺省值为：我知道了'}
 * 
 * 例：
 * iAlert({title:'温馨提示',text:'hello world',callback:function(){this.remove();删除提示框}})
 * iAlert({spinner:true, autoClosed:500});//页面加载中提示,500毫秒后自动关闭
*/
function iAlert(param){
	//可直接传字符串
	var temParam = "";
	if(typeof param == "string"){
		temParam = param;
		param = {};
	}
	var _this = this, 
			text = param.text || '',
			title = param.title || '温馨提示', 
			callback = param.callback || '', 
			btnshow = param.btnshow, //是否显示 按钮
			confirm = param.confirm, //是否为confirm提示，有【确定】和【取消】两个按钮
            autoClosed = param.autoClosed, //是否自动关闭,接收毫秒数
            bgOpactiy = param.bgOpactiy || 0.6, //背景透明度
            spinner = param.spinner, //正在加载中提示
			btext = param.btext || '确定';

	
	if(temParam.length){
		text = temParam;
	}
    $(".x_tip_box_css").empty().remove();//清除生成的样式
	var bg = $('<div class="x-tip-bg">'),
			box = $('<div class="x-tip-box">'),
			h1 = $('<h1>'),
			p = (typeof text === 'string'? $('<p>').html(text): text), //不是字符串即认为是jquery对象
			a = $('<a id="i_alert_tip__btn" href="javascript:void(0)">').html(btext).click(function(){
				
        				if(callback && typeof callback == "function"){
        					callback.call(_this, this);
        				}
                        _this.remove();
			}),
			a2 = $('<a href="javascript:void(0)">').css("width","50%").html("取消").click(_this.remove),
			style = $('<style class="x_tip_box_css" type="text/css">').html(bulidCss());
    
    if(spinner){
        //正在加载...
        // var sp = $("<div class='loading-spinner'>");//方块样式
        //三个ooo加载样式
        // var sp = $('<div class="loading-spinner-point"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
        //两个方块加载样式
        var sp = $('<div class="loading-spinner-cubemove"><div class="cube1"></div><div class="cube2"></div></div>');
        box.css({"background":'none',"border":'none'}).append(sp);  
    }else{
        if(title){
            h1.html(title);
            box.append(h1);
        }
        box.append(p);
        if(btnshow!==false){
            if(confirm===true){
                a.css("width","50%");
                box.append(a2).append(a);
            }else{
                box.append(a);  
            }
        }
    }
	
	remove();
    //自动关闭
    if(autoClosed){
        setTimeout(remove,autoClosed);
    }

	$('body').append(bg).append(box);
	$('head').append(style);

	//public fn.
	_this.remove = remove;
	
	//private fn
	function remove(){
		$(".x-tip-bg,.x-tip-box").empty().remove();
        $(".x_tip_box_css").empty().remove();//清除生成的样式
	}
	function bulidCss(){
		return '.x-tip-bg{width:100%;height:100%;overflow:hidden;margin:0 auto;position:fixed;top:0;left:0;background:rgba(0,0,0,'+bgOpactiy+');z-index:1000}.x-tip-box{position:fixed;top:15%;left:10%;z-index:1001;width:80%;height:auto;overflow:hidden;margin:0 auto;border-radius:5px;border:1px solid #CCC;background:#FFF}.x-tip-box h1{font-size:20px;font-weight:normal;text-align:center;font-family:"Microsoft YaHei";padding:10px 0 0px;}.x-tip-box p{text-align:center;font-size:14px;line-height:24px;width:90%;margin:0 auto;height:auto;overflow:hidden;color:#999;font-family:"Microsoft YaHei";padding:10px 0;}.x-tip-box a{font-size:18px;line-height:40px;height:40px;text-align:center;color:#2087fc;text-decoration:none;outline:0;display:block;width:100%;float:left;border-top:1px solid #CCC;font-family:"Microsoft YaHei"}';
	}
return _this;
}