var LoginMobilePageHeader = React.createClass({
    getInitialState: function(){
        var page = appTool.queryUrlParam('page');
        var title = '登录';
        if(page==='register'){
            title = '注册';
        }else if(page==='forget-pwd'){
            title = '忘记密码';
        }
        return {
            title: title
        }
    },
    componentDidMount:function(){
        $('.history-back').attr('href','/pages/home/home.html');
    },
    render: function () {
        return (
            <div className="login-page-header">
                <AlinkBack />
                <h1 className="title">{this.state.title}</h1>
            </div>
        );
    }
});
var LoginMobilePageBody = React.createClass({
    getInitialState: function(){
        var isother = appTool.queryUrlParam('page');
        var islossPwd = false;
        var _this = this,bridge = {};
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            bridge = event.bridge;
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
        });
        if(isother == 'forget-pwd')islossPwd=true;
        return {
            bridge: bridge,
            islogin: !isother,
            islossPwd: islossPwd
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
        //发短信
        $('#catch_code').click(function(){
            var mobile = $('#moblie_number').val();
            if(!mobile){
                iAlert('手机号不能为空');
                return false;
            }
             if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))){ 
                iAlert("手机号格式不正确"); 
                return false; 
            } 
            countdown();
            //请求校验码
            appTool.sendAjax(Uri.get_msg_code, {
                "user.phonenum": mobile
            }, function(d){
                console.log(d);
                $('#catch_code').data("code",d);
            }, function(errmsg){
                iAlert(errmsg);
            });
        });
        function countdown(){
            $('#catch_code').html(60);
            var n = 60;
            (function(){
                n--;
                if(n>0){
                    $('#catch_code').html("获取验证码("+n+")");
                    setTimeout(arguments.callee, 1000);
                }else{
                    $('#catch_code').html("获取验证码");
                }
            })();
        }
    },
    onLogin: function(e){
        var _this = this;
        //登录
        // /pages/home/home.html
        //注册
        var mobile = $('#moblie_number').val();
        var code = $('#check_code').val();
        var tart_a = e.target;
        if(!this.checkValidate()){
            return ;
        }
        appTool.sendAjax(Uri.user_action_mobilelogin, {
            "user.phonenum": mobile,
            "user.verifyCode": code
        }, function(d){
            //登录成功,将用户ID保存到app中
            appTool.savedUserLoginId(_this.state.bridge, d.userid);
            //缓存用户登录信息
            appTool.localSet("userInfoEntity",JSON.stringify(d));
            //登录成功跳回指定页面或去首页面
            // appTool.go("/pages/home/home.html");
            var pname = appTool.getLoginBackPage();
            if(pname){
                var gourl = appTool.pullHistoryLink(pname);
                appTool.go(gourl);
            }else{
                //去首页
                appTool.goHomePage(_this.state.bridge);
            }
        }, function(errmsg){
            iAlert(errmsg);
        });
    },
    onLossPwd: function(){
        //密码找回
        var code = $('#check_code').val();
        var mobile = $('#moblie_number').val();
        if(this.checkValidate()){
            appTool.go('/pages/login_password/login_password.html?code='+code+'&mobile='+mobile);
        }
    },
    checkValidate: function(){
        //注册
        var mobile = $('#moblie_number').val();
        var code = $('#check_code').val();
        var tempcode = $('#catch_code').data("code");
        if(!mobile){
            iAlert('手机号不能为空');
            return false;
        }else if(!code){
            iAlert('验证码不能为空');
            return false;
        }else if(tempcode != code){
            iAlert('验证码不正确');
            return false;
        }
        return true;
    },
    onRegister: function(e){
        var _this = this;
        //注册
        var mobile = $('#moblie_number').val();
        var code = $('#check_code').val();
        var tart_a = e.target;
        if(!this.checkValidate()){
            return ;
        }
        //注册
        appTool.sendAjax(Uri.user_action_register, {
            "user.phonenum": mobile,
            "user.verifyCode": code
        }, function(d){
            //登录成功,将用户ID保存到app中
            appTool.savedUserLoginId(_this.state.bridge, d.userid);
            //缓存用户登录信息
            appTool.localSet("userInfoEntity",JSON.stringify(d));
            //注册成功去首页
            // appTool.go("/pages/home/home.html");
            var pname = appTool.getLoginBackPage();
            if(pname){
                var gourl = appTool.pullHistoryLink(pname);
                appTool.go(gourl);
            }else{
                //去首页
                appTool.goHomePage(_this.state.bridge);
            }
        }, function(errmsg){
            iAlert(errmsg);
        });
        
    },
    render: function () {
        return (
            <div className="input-group login-page-body">
                <div className="input-row">
                    <label>国家地区</label>
                    <button className="btn btn-link btn-nav pull-right mobiletip86">
                        中国大陆{'+86'}
                        <span className="icon icon-right-nav"></span>
                    </button>
                </div>
                <div className="input-row">
                    <label>手机号码</label>
                    <input id="moblie_number" type="text" placeholder="请输入您的手机号"/>
                </div>
                <div className="input-row">
                    <input id="check_code" className="pull-left-checkcode" type="text" placeholder="请输入验证码"/>
                    <button id="catch_code" className="btn btn-nav pull-right pull-checkcode">
                        获取验证码
                    </button>
                </div>
                {
                    this.state.islogin?
                    <a data-transition="slide-in" href="#" onClick={this.onLogin} className="btn btn-positive btn-block">登录</a>:(
                        this.state.islossPwd?
                        <a data-transition="slide-in" href="#" onClick={this.onLossPwd} className="btn btn-positive btn-block">下一步</a>:
                        <a data-transition="slide-in" href="#" onClick={this.onRegister} className="btn btn-positive btn-block">下一步</a>
                    )
                }
                <p>
                {
                    this.state.islogin?
                    <a data-transition="slide-in" href="/pages/login/login.html" className="btn btn-link btn-nav pull-right">密码登录</a>:
                    null
                }
                </p>
                <p className="bottom-tip-xiyi">
                    <span>注册既视为您同意</span><font>小陌注册协议</font>
                </p>
            </div>

        );
    }
});


