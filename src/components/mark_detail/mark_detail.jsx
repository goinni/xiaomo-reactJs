var MarkDetailPageHeader = React.createClass({
    getInitialState: function(){
        
        return {
            title: appTool.queryUrlParam('title')
        }
    },
    render: function () {
        return (
            <div className="mark-detail-page-header">
                <AlinkBack />
                <h1 className="title">{this.state.title}</h1>
            </div>
        );
    }
});
var MarkDetailPageBody = React.createClass({
    getInitialState: function(){
        var _this = this,bridge = {},user = appTool.getUserInfoEntity() || {}, name=appTool.queryUrlParam('title');
        //添加标签访问记录
        appTool.sendAjax(Uri.mark_add_view_record,{
            "labelAnalysis.userid": user.userid,
            "labelAnalysis.name": name
        },function(res){
            //添加标签访问记录成功
        },function(err){
            // iAlert(err);
        });
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
            newslist: [],
            goodlist: [],
            pageSize: 10,
            reqParam:{},
            liketag: 'goods',
            labels: name,//标签名
            bridge: bridge,
            pagingUrl: Uri.person_shouchang_bbs,//缺省页面分页请求的URL
            user: user,
            scroll:{}
        }
    },
    componentDidMount: function(){
        var _this = this;

        //设置默认加载的数据
        _this.setState({
            shlist:[],
            newslist: [],
            reqParam:{
                "vmgoods.name":"",
                "vmgoods.labels": _this.state.labels,
                "vmgoods.currentPage": 1,
                "vmgoods.pageSize": _this.state.pageSize
            },
            pagingUrl: Uri.home_good_list
        });
        //页面加载完成移出提示
        appTool.rmPageLoading();
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.mark-detail-body', 44);
        //创建 导航
        $('<div class="markdetail-chang-nav-title"><ul><li name="1" class="active">商品</li><li name="2">资讯.帖子</li></ul></div>').appendTo('body');
        $('.markdetail-chang-nav-title li').click(function(){
            $('.no-data-tip').html('正在加载...');
            $('.markdetail-chang-nav-title li.active').removeClass('active');
            $(this).addClass('active');
            var indexName = $(this).attr('name');
            if(indexName == "1"){
                //商品
                 _this.setState({
                    liketag: 'goods',
                    shlist:[],
                    newslist: [],
                    reqParam:{
                        "vmgoods.name":"",
                        "vmgoods.labels": _this.state.labels,
                        "vmgoods.currentPage": 1,
                        "vmgoods.pageSize": _this.state.pageSize
                    },
                    pagingUrl: Uri.home_good_list
                });
            }else{
                //资讯
                _this.setState({
                    liketag: 'news',
                    shlist:[],
                    goodlist:[],
                    reqParam:{
                        "info.labels": _this.state.labels,
                        "info.currentPage": 1,
                        "info.pageSize": _this.state.pageSize
                    },
                    pagingUrl: Uri.news_good_list
                });
            }
            //加载第一页数据
            _this.onPullDown(_this.state.scroll);
        });
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(_this.state.pagingUrl, opt,function(res){
            var name = _this.state.liketag;
            if(!res.datas.length){
                //无数据删除提示
                appTool.superRemovePageLoading();
            }
            if(name === 'goods'){
                _this.setState({
                    currentPage: res.currentPage,
                    goodlist: isReset ? res.datas : _this.state.goodlist.concat(res.datas)
                });
            }else{
                _this.setState({
                    currentPage: res.currentPage,
                    newslist: isReset ? res.datas : _this.state.newslist.concat(res.datas)
                });
            }
            callback && callback();
        },function(err, status){
            if(status == 2){
                //无数据
                $('.no-data-tip').html('暂无数据');
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
            }
        });
    },
    onPullDown: function(paging){
        var _this = this;
        this.setState({
            scroll: paging
        });
        //下拉刷新
        this.loadPagingData(_this.state.reqParam, true, function(){
            setTimeout(function(){
                _this.state.scroll.refresh();
                //iframe页面特殊处理
                appTool.addFrameAevent();   
            },200);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        var _this = this;
        var name = _this.state.liketag;
        if(name === 'goods'){
            _this.setState({
                reqParam:{
                    "vmgoods.name":"",
                    "vmgoods.labels": _this.state.labels,
                    "vmgoods.currentPage": _this.state.currentPage+1,
                    "vmgoods.pageSize": _this.state.pageSize
                }
            });
        }else{
            _this.setState({
                reqParam:{
                    "info.labels": _this.state.labels,
                    "info.currentPage": _this.state.currentPage+1,
                    "info.pageSize": _this.state.pageSize
                }
            });
        }
        //加载数据 
        this.loadPagingData(_this.state.reqParam, false, function(){
            setTimeout(function(){_this.state.scroll.refresh()},200);
            //iframe页面特殊处理
            appTool.addFrameAevent();   
        });
    },
    render: function () {
        return (
<PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="mark-detail-body personal-page-body">
                <div className="card">
                    <span id="itemShContent" className="control-content active">
                        {
                            this.state.liketag=='goods'?
                            <div className="home-page-body">
                                {
                                    !this.state.goodlist.length?
                                    <center className="no-data-tip">正在加载...</center>:
                                    <HomeProductList path={this.state.systemparam} goods={this.state.goodlist} bridge={this.state.bridge}/>
                                }
                            </div>:
                            <div className="news-list-page-body">
                                {
                                    !this.state.newslist.length?
                                    <center className="no-data-tip">正在加载...</center>:
                                    <NewsHomeProductList path={this.state.systemparam} newslist={this.state.newslist} bridge={this.state.bridge}/>
                                }
                            </div>
                        }
                    </span>
                </div>
            </div>
</PullPaging>
        );
    }
});


