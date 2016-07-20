var CommunitySharePageHeader = React.createClass({
    getInitialState: function(){
        $('body').addClass('no-timer-top-bar');//设置顶部没有时间工具条样式
        return {};
    },
    render: function () {
        return (
            <div className="community-page-header">
                <h1 className="title">小陌社区</h1>
                <a className="btn btn-link btn-nav pull-right share-qa-btn-play">
                    <span className="icon icon-left-nav"></span>
                </a>
            </div>
        );
    }
});
var CommunitySharePageBody = React.createClass({
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
            sortid: 2,
            currentPage: 1,
            pageSize: 10,
            bridge: bridge,
            qalist: [],
            shlist: []
        }
    },
    componentDidMount: function(){
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.community-body', 0);
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.community_share_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                shlist: isReset ? res.datas : _this.state.shlist.concat(res.datas)
            });
            callback && callback();
        });
    },
    onPullDown: function(paging){
        //下拉刷新
        this.loadPagingData({
            "bbsPost.currentPage": 1,
            "bbsPost.pageSize": this.state.pageSize,
            'bbsPost.sortid': this.state.sortid
        }, true, function(){
            setTimeout(function(){paging.refresh()},500);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "bbsPost.currentPage": this.state.currentPage+1,
            "bbsPost.pageSize": this.state.pageSize,
            'bbsPost.sortid': this.state.sortid
        }, false, function(){
            setTimeout(function(){paging.refresh()},500);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    render: function () {

        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="community-body">
                <div className="card">
                    <span id="communityItemShareContent" className="control-content active">
                            <CommunityShareCom list={this.state.shlist} bridge={this.state.bridge}/>
                    </span>
                </div>
            </div>
            </PullPaging>
        );
    }
});