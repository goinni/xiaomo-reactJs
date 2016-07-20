(function(win){
    win.appTool = {
        /**
         *  ajax请求
         */
        sendAjax : function(url, data, successCallback, errorCallback, dataType, method, async){
            if (navigator.onLine === false){
                iAlert('网络已中断，请检查网络连接设置');
                return;
            }
            $.ajax({
                url: url,
                dataType: dataType || 'json',
                type: method || 'GET',
                data: data || {},
                async: async === false ? false: true,
                complete: function(res){
                    var resp = JSON.parse(res.responseText);
                    if (resp.status == 0){
                        if (successCallback){
                            successCallback(resp.result, resp);
                        }
                    }else {
                        if (errorCallback){
                            errorCallback(resp.message, resp.status);
                        } else {
                            console.log("sendAjax is error!");
                        }
                    }
                }
            });
        },
        /**
         * 加载分页页面主要数据时调用，一个页面只能调用一次
         * 【注】页面一定要有 .img-box img ，若没有请主动调用移除遮罩
         * .img-box img 是特定图片加载，待加载完成后进行遮罩删除
         */
        sendPageAjax: function(url, data, successCallback, errorCallback, dataType, method, async){
            this.sendAjax(url, data, successCallback, errorCallback, dataType, method, async);
            //加载完页面后将提示关闭
            this.rmPageLoading('.img-box img');
        },
        /**
         * 页面加载提示
         */
        pageLoading: function(){
            $("#page-content-part").addClass('content-blur-filter');//页面加载中背景模糊
            this._tempPageLoad = iAlert({
                spinner: true,
                bgOpactiy: 0.01
            });
        },
        /**
         * 删除提示
         */
        rmPageLoading: function(imgs){
            var _this = this;
            //图片加载完成
            this.imgsIsLoaded(clean, imgs);
             // clean();
            //清除遮罩
            function clean(){
                if(_this._tempPageLoad){
                    _this._tempPageLoad.remove();
                    $("#page-content-part").removeClass('content-blur-filter');//加载完成后去掉模糊效果
                    if(win._page_iscroll_entity){
                        setTimeout(function(){
                            win._page_iscroll_entity.refresh();
                        },300);
                    }
                }
            }

        },
        superRemovePageLoading: function(){
            var _this = this;
            if(_this._tempPageLoad){
                _this._tempPageLoad.remove();
                $("#page-content-part").removeClass('content-blur-filter');//加载完成后去掉模糊效果
            }
        },
        footerBarHide: function(){
            $('#footer-menubar-part').hide();
        },
        footerBarShow: function(){
            $('#footer-menubar-part').show();
        },
        /**
         * 判断页面所有图片是否加载完成
         */
        imgsIsLoaded: function(cbk, selecter){
            var t_img; // 定时器
            var isLoad = true; // 控制变量
            // 判断图片加载状况，加载完成后回调
            isImgLoad(cbk);
             
            // 判断图片加载的函数
            function isImgLoad(callback){
                //这里是我的商品列表图片,这里可以根据自己需求进行修改
                var goodsImgSize; 
                if(selecter){
                    goodsImgSize = $(selecter).size();
                }
                // 查找所有封面图，迭代处理
                $('img').each(function(){
                    // 找到为0就将isLoad设为false，并退出each
                    if(this.height === 0){
                        isLoad = false;
                        return false;
                    }
                });
                //商品图片没有加载出来继续等待加载
                if(!goodsImgSize && selecter) isLoad = false;
                // 为true，没有发现为0的。加载完毕
                if(isLoad){
                    clearTimeout(t_img); // 清除定时器
                    // 回调函数
                    callback();
                // 为false，因为找到了没有加载完成的图，将调用定时器递归
                }else{
                    isLoad = true;
                    t_img = setTimeout(function(){
                        isImgLoad(callback); // 递归扫描
                    },200); // 我这里设置的是500毫秒就扫描一次，可以自己调整
                }
            }
        },
        /**
         * 地址跳转
         * @param url 跳转到指定URL
         */
        go: function(url){
            window.location.href=url;
        },
        /**
         * 获取浏览器参数名称
         * @param name 浏览器地址参数名
         */
        queryUrlParam : function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) return decodeURIComponent(r[2]); return null;
        },
        /**
         * 设置页面字体大小
         * @param size
         */
        initFontSize: function(){
            var fontSize = (document.documentElement.clientWidth / 20) || 16;
             document.documentElement.style.fontSize = fontSize + 'px';
        },
        /**
         * 本地长时间缓存
         */
        localSet : function(k, v){
            if (typeof v === 'object'){
                v = JSON.stringify(v);
            }
            localStorage.setItem(k, v);
            return this;
        },

        localGet : function(k){
            return localStorage.getItem(k);
        },

        localGetJson : function(k){
            var r = this.localGet(k);
            if(!r){
                return "";
            }
            return JSON.parse(r);
        },

        localRemove : function(k){
            localStorage.removeItem(k);
            return this;
        },

        localClear : function(){
            localStorage.clear();
            return this;
        },

        /**
         * 浏览器关闭清缓存
         */
        sessionSet : function(k, v){
            if (typeof v === 'object'){
                v = JSON.stringify(v);
            }
            sessionStorage.setItem(k, v);
            return this;
        },

        sessionGet : function(k){
            return sessionStorage.getItem(k);
        },

        sessionGetJson : function(k){
            var r = this.sessionGet(k);
            if(!r){
                return "";
            }
            return JSON.parse(r);
        },

        sessionRemove : function(k){
            sessionStorage.removeItem(k);
            return this;
        },

        sessionClear : function(){
            sessionStorage.clear();
            return this;
        },

        /**
         * 是否在微信中打开
         */
        isWx : function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.indexOf('micromessenger') !== -1){
                return true;
            }else{
                return false;
            }
        },
        createImgBase64: function (img, file) {
             var ua = navigator.userAgent.toLowerCase();
             if (ua.match(/chrome\/([\d.]+)/)) {
                 //Chrome8+
                 img.src = window.webkitURL.createObjectURL(file);
             } else if (ua.indexOf("gecko/")>0) {
                 //FF4+
                 img.src = window.URL.createObjectURL(file);
             } else {
                 //实例化file reader对象
                 var reader = new FileReader();
                 reader.onload = function (e) {
                     img.src = this.result;
                 };
                 reader.readAsDataURL(file);
             }
             return img;
         },
        /**
         * html5定位
         * ----------------------------------
         * @param callback 回调方法
         * @param errorcallback 定位异常回调
         * ----------------------------------
         * callback(coords)
         * 回调方法参数 接受经纬度对象
         * ----------------------------------
         * @param coords
         * coords.longitude
         * coords.latitude
         * ----------------------------------------
         */
        geoLocation: function( callback, errorcallback ){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, showError);
                } else {
                    iAlert("Geolocation is not supported by this browser.");
                }
    
                function showPosition(position) {
                    callback && callback.call(position, position.coords);
                }
    
                function showError(error) {
                    errorcallback && errorcallback.call(error);
                    switch (error.code) {
                    case error.PERMISSION_DENIED:
//                          iAlert("User denied the request for Geolocation.");
                        iAlert("用户拒绝请求地理位置.");
                        break;
                    case error.POSITION_UNAVAILABLE:
//                          iAlert("Location information is unavailable.");
                        iAlert("位置信息是不可用的.");
                        break;
                    case error.TIMEOUT:
//                          iAlert("The request to get user location timed out.");
                        iAlert("超时请求获取用户位置.");
                        break;
                    case error.UNKNOWN_ERROR:
//                          iAlert("An unknown error occurred.");
                        iAlert("发生了一个未知错误");
                        break;
                    default:
                        iAlert("other error!");
                        break;
                    }
                }               
        },
        /**
         * 按装webview与js通信的桥梁
         */
        installWebview:function(callback){
            //该事件只针对IOS可用
            //详情见下面地址
            // https://github.com/marcuswestin/WebViewJavascriptBridge
            document.addEventListener('WebViewJavascriptBridgeReady', callback, false);
        },
        /**
         * 添加一个地址历史记录
         */
        pushHistoryLink: function(url){
            var links = this.localGet('_history_links'); 
            var tempUrl = url || window.location.href;
            if(links){
                links = links.split(',');
            }else{
                links = [];
            }
            if(!(links.length && tempUrl === links[links.length-1])){
                links.push(tempUrl); //不存在缓存当前页面地址
                this.localSet('_history_links', links.join(','));
            }
        },
        /**
         * 获取上页页面的历史地址
         */
        pullHistoryLink: function(pageName){
            var links = this.localGet('_history_links'); 
            var prepage = "";
            if(links){
                links = links.split(',');
                if(pageName){
                    //从后往前查出匹配的地址
                    for(var i = (links.length-1); i>=0; i--){
                        if(links[i].indexOf(pageName)!=-1){
                            links = links.slice(0,i+1);
                            break;
                        }
                    }
                }else{
                    links.pop();//删除当前页面
                }
                prepage = links.pop();//上一个页面地址
                this.localSet('_history_links', links.join(',')); //更新缓存
                return prepage;
            }
        },
        /**
         * 清除历史记录地址
         */
        clearHistoryLink: function(){
            var links = this.localGet('_history_links'); 
            if(links){
                links = links.split(',');
                var templink = links.pop();
                this.localSet('_history_links',templink);  
            }
        },
        /**
         * 设置div高度为屏幕高度
         * @param elem zepto选择器
         */
        setElemWithScreenHeight: function(elem, x){
            var height= (window.innerHeight > 0) ? window.innerHeight : screen.height;
            $(elem).css('min-height', height - x );
        },
        /**
         * 获取用户登录信息
         */
        getUserInfoEntity: function(){
            var r = this.localGetJson("userInfoEntity");
            //获取本地缓存的用户ID
            var appCatchUserId = appTool.localGet('app_cache_login_userid') || this.queryUrlParam('userid');
            if(!r && appCatchUserId){
                r = {
                    userid: appCatchUserId
                };
                // 个人基本信息
                appTool.sendAjax(Uri.personal_base_info,{
                    "user.userid": appCatchUserId
                },function(res){
                    //缓存用户登录信息
                    appTool.localSet("userInfoEntity", res);
                },function(err){
                    // iAlert("个人基础信息初始化失败");
                });
            }
            return r;
        },
        /**
         * 清除用户登录信息
         */
        clearUserInfoEntity: function(){
            this.localRemove('app_cache_login_userid');
            return this.localRemove("userInfoEntity");
        },
        /**
         * 设置登录后跳转的地址
         */
        setLoginBackPage:function(pageName){
            this.sessionSet('_login_back_page',pageName); 
        },
        /**
         * 获取登录后跳转的地址
         */
        getLoginBackPage:function(){
            var r = this.sessionGet('_login_back_page'); 
            this.sessionSet('_login_back_page',''); //取出临时数据后删除
            return r;
        },
        /**
         * 处理iframe中a标签点击跳转
         */
        addFrameAevent: function(){
            //页面类型，如果从iframe页面过来pagetype会有值
            var pagetype = this.queryUrlParam('pagetype');
            if(pagetype === 'iframe'){
                $('a').click(function(){
                    var href = $(this).attr('href');
                    window.top.location.href=href;
                });
            }
        },
        /**
         * 设置iframe页面初始值
         */
        iframePageInit: function(){
            var pagetype = appTool.queryUrlParam('pagetype');
            if(pagetype === 'iframe'){
                $('body').addClass('no-timer-top-bar');//设置顶部没有时间工具条样式
            }else{
                $('body').removeClass('no-timer-top-bar');
            }
        },
        /**
         * 没有登录的去登录
         * @param pagename 登录后跳转回来的页面名
         */
        playLogin: function(bridge, pagename){
            var userEntity = this.getUserInfoEntity();
            if(!userEntity){
                //页面处理登录
                // appTool.setLoginBackPage(pagename); //设置登录成功后跳回的地址
                // appTool.go('/pages/login_mobile/login_mobile.html');

                //请求app跳转到登录页面play_do_login
                var oc_url = win.location.href;
                var iosdata = appTool.setAppData("页面请求登录", oc_url, "icenterlogin");
                //IOS通信回调
                appTool.sendAppData(bridge, iosdata);
                return false;
            }
        },
        /**
         * 初始化系统参数 
         */
        initSystemParam: function(){
            //加载系统参数
            var systemparam = $.ajax({
                          url: Uri.getSystemParam,
                          async: false
                         }).responseText;
            this.localSet("_init_System_Param", systemparam);
            return JSON.parse(systemparam);
        },
        /**
         * 获取系统参数
         */
        getSystemParam: function(){
            var r = this.localGetJson("_init_System_Param");
            if(!r){
                return this.initSystemParam();
            }
            return r;            
        },
        /**
         * 给app传递相关参数
         * @param title 标题
         * @param url 跳转地址 [注]必需转码
         * @param type 页面类型，页面标记做用
         * @param other 其它参数
         */
        setAppData: function(title, url, type, other){
            return {
                title: title,
                url: encodeURI(url), 
                type: type,
                other: other
            }
        },
        /**
         * 向IOS发送数据 并 接受回调
         * @param bridge see this.installWebview
         * @param iosdata ios接受的数据对象{...} ,@see this.setAppData(...)
         * @param callback 回调
         */
        sendAppData: function(bridge, iosdata, callback){
            //IOS通信回调
            if(bridge && bridge.callHandler){
                bridge.callHandler('webviewCallback', iosdata, function(response) {
                        callback && callback(response);
                });
            }
        },
        /**
         * oc 调用h5
         * @param data oc传给h5的参数
         */
        callH5: function(data){
            // alert(data);//提示
            if(appTool && appTool.ocToH5callback){
                //oc调用h5时，应用内部能用接口appTool.ocToH5callback
                appTool.ocToH5callback(data);
            }
        },
        /**
         * 校验是否存在app对象
         */
        hasAppBridge: function(bridge){
            return (bridge && bridge.callHandler || false);
        },
        /**
         * (小时:分钟:秒) 倒计时
         * @param countvalue 倒计时的总毫秒数
         * @param callback 计时结束回调
         */
        timerCountDown: function(seleter, countvalue, callback){
            // 递归处理器
            // var n = 30;//倒计时30分钟
            // var countvalue = n * 60;//单位: 秒
            var miao = 60*60;//秒（一小时60分一分60秒）
            (function(){
                countvalue-- ;//每秒递减
                if(countvalue>0){
                    var hour = parseInt(countvalue/miao);
                    var min = parseInt((countvalue%miao)/60);//求余秒数再除60转分钟
                    var ss = (countvalue-(hour*miao)-(min*60));
                    var time = (hour<10?'0'+hour : hour)+":"+(min<10?'0'+min : min)+":"+(ss<10?'0'+ss:ss);
                    $(seleter).html(time);
                    setTimeout(arguments.callee, 1000);
                }else{
                    // 计时完成后回调
                    callback && callback();
                }
            })();
        },
        /**
         * 防止iScroll重复点击
         * @param callback 回调处理
         * @param time 时间间隔 毫秒
         */
        lazyDoit: function(callback, time){
                var t = time || 1000;
                if (!appTool.___lazy_time){
                    appTool.___lazy_time = new Date().getTime();
                }else{
                    var t2 = new Date().getTime();
                    if(t2 - appTool.___lazy_time < t){
                        appTool.___lazy_time = t2;
                        return;
                    }else{
                        appTool.___lazy_time = t2;
                    }
                }
                callback && callback.call(this);
        },
        goHomePage: function(bridge){
            //跳转到首页
            var oc_url = "/pages/home_new/home_new.html";
            var iosdata = appTool.setAppData("首页", oc_url, "home_new");
            //IOS通信回调
            appTool.sendAppData(bridge, iosdata);
            if(!appTool.hasAppBridge(bridge)){
                appTool.go(oc_url);
            }
        },
        savedUserLoginId: function(bridge, userid){
            //登录 成功 
            var oc_url = userid;
            var iosdata = appTool.setAppData("将用户登录ID缓存到app里", oc_url, "saved_login_userid");
            //IOS通信回调
            appTool.sendAppData(bridge, iosdata);
        },
        loginOutUserPlay: function(bridge){
            //退出登录 
            appTool.localRemove("app_cache_login_userid");//清除本地缓存的用户ID
            var oc_url = "";
            var iosdata = appTool.setAppData("退出登录,通知app清除缓存的用户ID", oc_url, "clean_saved_login_userid");
            //IOS通信回调
            appTool.sendAppData(bridge, iosdata);
        },
        cookie: function(){
            /**
                var cookie = new Cookie();
                //设置
                cookie.put("myname","houzhenyu",1*24*60*60*1000);
                //获取
                cookie.get("myname");
            */
            function Cookie(){
                 //设置cookie; name名,value值,time时间
                 //1天 = 1*24*60*60*1000; 单位：毫秒
                 this.put=function(name,value,time){
                     var todayDate = new Date();
                     todayDate.setTime(todayDate.getTime() + time);
                     document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"   
                 }
                 //获取cookie
                 this.get=function(name){
                     var nameOfCookie = name + "=";
                     var x = 0;
                     while (x <= document.cookie.length) {
                         var y = (x + nameOfCookie.length);
                         if (document.cookie.substring(x, y) == nameOfCookie) {
                            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                             endOfCookie = document.cookie.length;
                             return unescape(document.cookie.substring(y, endOfCookie));
                         }
                         x = document.cookie.indexOf(" ", x) + 1;
                         if (x == 0)
                         break;
                     }
                     return "";   
                 }   
            }
            return new Cookie();
        },
        /**
         * Toast提示 ，样式在public.scss文件里
         */
        toast: function(text){
            var tipDom = $('.toast-tip-box_');
            if(tipDom.size()){
                $('.toast-tip-box_').fadeOut(function(){
                    $(this).empty().remove();
                    xtip();
                });
            }else{
                xtip();
            }
            
            function xtip(){
                $('<div class="toast-tip-box_">').append(text).appendTo('body');
                $('.toast-tip-box_').animate({ 
                                        width: "50%",
                                        // height: "80px", 
                                        left: "25%",
                                        bottom: "200px",
                                        fontSize: "14px", 
                                        opacity: 0.7
                                      },function(){
                                        var _t = this;
                                        setTimeout(function(){
                                            $(_t).animate({ 
                                                width: "0",
                                                // height: "80px", 
                                                left: "50%",
                                                bottom: "0px",
                                                fontSize: "0", 
                                                opacity: 0
                                              },function(){
                                                $(_t).empty().remove();
                                              });
                                        },3000);
                                      });
            }
        }

    };

})(window);