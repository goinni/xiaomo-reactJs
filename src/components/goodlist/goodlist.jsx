var GoodListPageHeader = React.createClass({
    getInitialState: function(){
        appTool.iframePageInit();
        return {};
    },
    render: function () {
        return (
            <div className="goodlist-page-header">
                    <AlinkBack />
                    <h1 className="title">商品列表</h1>
            </div>
        );
    }
});
var GoodListPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, banners = [], bridge={};

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
            systemparam: appTool.getSystemParam(),//获取系统参数
            currentPage: 1,
            pageSize: 10,
            goods:[],
            bridge: bridge
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.home_good_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                goods: isReset ? res.datas : _this.state.goods.concat(res.datas)
            });
            //下拉刷新上拉加载回调用
            callback && callback();
        },function(err, stauts){
            if(stauts == 2){
                //无数据
                $('.no-data-tip').html('暂无数据');
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
            }
        });
    },
    componentDidMount: function(){
        

    },
    onPullDown: function(paging){
        this.setState({
            scroll: paging
        });
        //下拉刷新
        this.loadPagingData({
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,

            "vmgoods.name":"",
            "vmgoods.labels":"",
            "vmgoods.currentPage": 1,
            "vmgoods.pageSize": this.state.pageSize
        }, true, function(){
            setTimeout(function(){paging.refresh()},500);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,
            
            "vmgoods.name":"",
            "vmgoods.labels":"",
            "vmgoods.currentPage": this.state.currentPage+1,
            "vmgoods.pageSize": this.state.pageSize
        }, false, function(){
            paging.refresh();
        });
    },
    render: function () {
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
                <div className="home-page-body">
                    {
                        !this.state.goods.length?
                        <center className="no-data-tip">正在加载...</center>:
                        <HomeProductList path={this.state.systemparam} goods={this.state.goods} bridge={this.state.bridge}/>
                    }
                </div>
            </PullPaging>
        );
    }
});


