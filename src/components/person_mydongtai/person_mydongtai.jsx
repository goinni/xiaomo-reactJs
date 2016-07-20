var PersonalMyDongtaiPageHeader = React.createClass({
    getInitialState: function(){
        return {
            pagetype: appTool.queryUrlParam('pagetype')
        };
    },
    componentDidMount:function(){
    },
    closeWinFrame:function(){
        window.top.closePersonFrame();
    },
    render: function () {
        return (
            <div className="personal-mydongtai-page-header">
                    {
                        this.state.pagetype=='iframe'?<span onClick={this.closeWinFrame} className="icon icon-close pull-left"></span>:<AlinkBack />
                    }
                  <h1 className="title">我的动态</h1>
            </div>
        );
    }
});
var PersonalMyDongtaiPageBody = React.createClass({
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
            currentPage: 1,
            pageSize: 10,
            actionlist: [],
            user: appTool.getUserInfoEntity() || "",
            scroll:{}
        }
    },
    deleteAcInfo: function(e){
        //删除发表的状态
        var _this =  this;
        var entity = e.srcElement || e.target;
        var li = $(entity).parent().parent();
        //[注]把对应的数据 找到删除
        li.hide();
        var liId = li.attr('name');
        var alist = this.state.actionlist;
        for(var i = 0; i<alist.length; i++){
            if(liId == alist[i].postid){
                alist.splice(i,1);
                _this.setState({
                    actionlist : alist
                });
                break;
            }
        }
        var count = $('.mine-dongtai li').size();
        if(!count){
            $('.mine-dongtai').html('<center>亲，去发表个动态吧~</center>');
        }
        setTimeout(function(){_this.state.scroll.refresh()},200);
    },
    componentDidMount: function(){
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.person_mine_actions, opt,function(res){
             _this.setState({
                currentPage: res.currentPage,
                actionlist: isReset ? res.datas : _this.state.actionlist.concat(res.datas)
            });
            callback && callback();
        });
    },
    onPullDown: function(paging){
        this.setState({
            scroll: paging
        });
        if(this.state.user){
            //下拉刷新
            this.loadPagingData({
                "bbsPost.userid": this.state.user.userid,
                "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
                "bbsPost.currentPage": 1,
                "bbsPost.pageSize": this.state.pageSize
            },true, function(){
                setTimeout(function(){paging.refresh()},200);
                //iframe页面特殊处理
                appTool.addFrameAevent();
            });
        }
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "bbsPost.userid": this.state.user.userid,
            "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
            "bbsPost.currentPage": this.state.currentPage+1,
            "bbsPost.pageSize": this.state.pageSize
        },false,function(){
            setTimeout(function(){paging.refresh()},200);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    render: function () {
        
        return (
<PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="personal-mydongtai-body personal-page-body">
                <div className="card">
                    <span id="itemQaContent" className="control-content active">
                        <PersonalActionList list={this.state.actionlist} ondelete={this.deleteAcInfo} bridge={this.state.bridge}/> 
                    </span>
                </div>
            </div>
</PullPaging>
        );
    }
});
