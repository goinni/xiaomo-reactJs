var LoginPageHeader = React.createClass({
    render: function () {
        return (
            <div className="login-page-header">
                <AlinkBack />
                <h1 className="title">登录</h1>
            </div>
        );
    }
});
var LoginPageBody = React.createClass({
    getInitialState: function(){
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
        return {
            bridge: bridge
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    dologin: function(e){
        var _this = this;
        var account = $('#user_account').val();
        var pwd = $('#user_pwd').val();
        var tart_a = e.target;
        if(!account){
            iAlert("请输入您的账号");
            return;
        }else if(!pwd){
            iAlert("请输入您的密码");
            return;
        }
        var url = Uri.login_action_pwd,
            data = {
                'user.phonenum': account,
                'user.password': pwd
            },
            successCallback = function(d){
                //登录成功,将用户ID保存到app中
                appTool.savedUserLoginId(_this.state.bridge, d.userid);

                //缓存用户登录信息
                appTool.localSet("userInfoEntity",JSON.stringify(d));
                var pname = appTool.getLoginBackPage();
                if(pname){
                    var gourl = appTool.pullHistoryLink(pname);
                    appTool.go(gourl);
                }else{
                    //去首页
                    appTool.goHomePage(_this.state.bridge);
                }
            },
            errorCallback = function(errmsg){
                //登录失败
                iAlert(errmsg);
            };
        //登录
        appTool.sendAjax(url, data, successCallback, errorCallback);
    },
    render: function () {
        return (
            <form className="input-group">
              <div className="input-row">
                <label>账号</label>
                <input type="text" placeholder="请输入您的账号" id="user_account"/>
              </div>
              <div className="input-row">
                <label>密码</label>
                <input type="password" placeholder="请输入您的密码" id="user_pwd"/>
              </div>
            <a href="#" onClick={this.dologin} className="btn btn-positive btn-block">登录</a>
            <p>
                <a href="/pages/login_mobile/login_mobile.html?page=register" className="btn btn-link btn-nav pull-left">
                免费注册
                </a>
                <a href="/pages/login_mobile/login_mobile.html?page=forget-pwd" className="btn btn-link btn-nav pull-right">
                忘记密码
                </a>
            </p>
            </form>

        );
    }
});


