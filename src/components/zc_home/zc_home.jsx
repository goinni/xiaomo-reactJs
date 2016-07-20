var ZcHomePageHeader = React.createClass({
    render: function () {
        return (
            <div className="zc-home-page-header">
                <AlinkBack />
                <h1 className="title">自测首页</h1>
            </div>
        );
    }
});
var ZcHomePageBody = React.createClass({
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
            bridge: bridge,
            scroll: {},
            list:[]
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        $('.go-zc-pp img').click(function(){
            var oc_url = "/pages/zc_people_info/zc_people_info.html";
            var iosdata = appTool.setAppData("提交身体信息", oc_url, "zc_people_info");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
    },
    pagescrollload:function(scroll){
        this.state.scroll = scroll;
        scroll.refresh();
    },
    render: function () {
        
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="zc-home-body">
                <img className="desc" src="/assets/zc3.png"/>
                <img className="timg" src="/assets/zc1.png"/>
                <div className="btn go-zc-pp" >
                    <img src="/assets/zc2.png"/>
                </div>
                <p>根据具体症状匹配适宜的药品</p>
                <p>为您提供科学的用药指导</p>
            </div>
</SimplePageScroll>
        );
    }
});


