var PersonSetingPageHeader = React.createClass({
    render: function () {
        return (
            <div className="personseting-page-header">
                <AlinkBack />
                <h1 className="title">个人设置</h1>
            </div>
        );
    }
});
var PersonSetingPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, bridge;
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            bridge = event.bridge
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
        });
        return {
            user: appTool.getUserInfoEntity(),
            bridge: bridge
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示

        $('.p-set-item1').click(function(){
            var yaoqing_url = '/pages/yaoqing/yaoqing.html';
            var yaoqing_linkdata = appTool.setAppData("邀请朋友", yaoqing_url, "share");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, yaoqing_linkdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(yaoqing_url);
            }
        });
        $('.p-set-item2').click(function(){
            appTool.playLogin(_this.state.bridge, 'person_seting'); //校验登录
            if(_this.state.user && _this.state.user.userid){
                var person_info_url = '/pages/person_info/person_info.html';
                var person_info_linkdata = appTool.setAppData("个人资料", person_info_url, "person_info");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, person_info_linkdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(person_info_url);
                }
            }
        });
        $('.p-set-item3').click(function(){
            appTool.playLogin(_this.state.bridge, 'person_seting'); //校验登录
            if(_this.state.user && _this.state.user.userid){
                var account_url = '/pages/person_account/person_account.html';
                var account_linkdata = appTool.setAppData("账号绑定", account_url, "account");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, account_linkdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(account_url);
                }
            }
        });
        $('.p-set-item4').click(function(){
            // var tempuser = appTool.getUserInfoEntity();
            iAlert({
                text: '确定要清理缓存嘛~',
                callback: function(){
                    appTool.localClear();
                    appTool.sessionClear();
                    appTool.loginOutUserPlay(_this.state.bridge);//通知app清除缓存的用户ID
                    iAlert('亲,清理完毕~');
                    window.location.reload();
                },
                confirm: true
            });
        });
        $('.p-set-item5').click(function(){
            var yijian_url = '/pages/person_yijian/person_yijian.html';
            var yijian_linkdata = appTool.setAppData("反馈", yijian_url, "yijian");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, yijian_linkdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(yijian_url);
            }
        });
        $('.p-set-item6').click(function(){
            var about_us_url = '/pages/about_us/about_us.html';
            var about_us_linkdata = appTool.setAppData("关于小陌", about_us_url, "about_us");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, about_us_linkdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(about_us_url);
            }
        });

    },
    loginOut: function(e){
        var _this = this;
        //注销登录
        //请求后台
        //清除缓存
        appTool.loginOutUserPlay(_this.state.bridge); //通知app清除缓存的用户ID
        appTool.clearUserInfoEntity();
        window.location.reload();
    },
    render: function () {
        
        return (
            <div className="personseting-body">
                <ul className="table-view">
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item1">
                        邀请朋友
                    </a>
                  </li>
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item2">
                      个人资料
                    </a>
                  </li>
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item3">
                      账号绑定 
                    </a>
                  </li>
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item4">
                      清理缓存
                    </a>
                  </li>
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item5">
                      反馈
                    </a>
                  </li>
                  <li className="table-view-cell">
                    <a className="navigate-right p-set-item6">
                      关于小陌
                    </a>
                  </li>
                </ul>
                {
                    this.state.user?
                    <a onClick={this.loginOut} className="zx-btn">注销</a>:null
                }
                
            </div>

        );
    }
});


