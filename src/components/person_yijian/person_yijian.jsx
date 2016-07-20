var PersonYijianPageHeader = React.createClass({
    render: function () {
        return (
            <div className="personyijian-page-header">
                <AlinkBack />
                <h1 className="title">意见反馈</h1>
            </div>
        );
    }
});
var PersonYijianPageBody = React.createClass({
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
            bridge: bridge
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        $('.p-ac-w1').click(function(){
            var oc_url = "/pages/person_yj_account/person_yj_account.html";
            var iosdata = appTool.setAppData("账号问题", oc_url, "person_yj_account");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        $('.p-ac-w2').click(function(){
            var oc_url = "/pages/person_yj_shequ/person_yj_shequ.html";
            var iosdata = appTool.setAppData("社区问题", oc_url, "person_yj_shequ");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        $('.p-ac-w3').click(function(){
            var oc_url = "/pages/person_yj_action/person_yj_action.html";
            var iosdata = appTool.setAppData("活动问题", oc_url, "person_yj_action");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        $('.p-ac-w4').click(function(){
            var oc_url = "/pages/person_yj_jianyi/person_yj_jianyi.html";
            var iosdata = appTool.setAppData("功能建议", oc_url, "person_yj_jianyi");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });

    },
    render: function () {
        return (
            <div className="personyijian-body">
                    <ul className="table-view">
                      <li className="table-view-cell media">
                        <a className="navigate-right p-ac-w1">
                          <span className="media-object pull-left icon icon-trash"></span>
                          <div className="media-body">
                                账号问题
                          </div>
                        </a>
                      </li>
                      <li className="table-view-cell media">
                        <a className="navigate-right p-ac-w2">
                          <span className="media-object pull-left icon icon-gear"></span>
                          <div className="media-body">
                                社区问题
                          </div>
                        </a>
                      </li>
                      <li className="table-view-cell media">
                        <a className="navigate-right p-ac-w3">
                          <span className="media-object pull-left icon icon-pages"></span>
                          <div className="media-body">
                                活动问题
                          </div>
                        </a>
                      </li>
                      <li className="table-view-cell media">
                        <a className="navigate-right p-ac-w4">
                          <span className="media-object pull-left icon icon-pages2"></span>
                          <div className="media-body">
                                功能建议
                          </div>
                        </a>
                      </li>
                    </ul>
            </div>

        );
    }
});


