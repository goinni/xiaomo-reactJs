var PersonAccountPageHeader = React.createClass({
    render: function () {
        return (
            <div className="personaccount-page-header">
                <AlinkBack />
                <h1 className="title">账号绑定</h1>
            </div>
        );
    }
});
var PersonAccountPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, bridge = {};
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
            bridge: bridge,
            user: appTool.getUserInfoEntity()
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.playLogin(_this.state.bridge, 'person_account'); //校验登录
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="personaccount-body">
                <ul className="table-view">
                      <li className="table-view-cell media">
                        <a className="navigate-right">
                          <span className="media-object pull-left icon icon-person"></span>
                          <div className="media-body">
                            手机
                          </div>
                        </a>
                        <font>{this.state.user.phonenum}</font>
                      </li>
                </ul>
            </div>

        );
    }
});


