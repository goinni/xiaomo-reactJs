var PersonalMyLikePageHeader = React.createClass({
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
            <div className="personal-mylike-page-header">
                    {
                        this.state.pagetype=='iframe'?<span onClick={this.closeWinFrame} className="icon icon-close pull-left"></span>:<AlinkBack />
                    }
                  <h1 className="title">我的喜欢</h1>
            </div>
        );
    }
});
var PersonalMyLikePageBody = React.createClass({
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
            currentPage: 1,
            newslist: [],
            goodlist: [],
            shlist: [],
            pageSize: 10,
            reqParam:{},
            liketag: 'bbs',
            bridge: bridge,
            pagingUrl: Uri.person_shouchang_bbs,//缺省页面分页请求的URL
            user: appTool.getUserInfoEntity() ,
            scroll:{}
        }
    },
    componentDidMount: function(){
        var _this = this;
        $('<div class="mine-like-three-nav"><dl><dd name="goods">商品</dd><dd name="news">资讯</dd><dd name="bbs" class="ac">帖子</dd></dl></div>').appendTo('body');
        appTool.setElemWithScreenHeight('#itemShContent', 50);//设置页面最小高度为屏幕尺寸
        //初始化请求参数
        _this.setState({
            reqParam:{
                "userCollect.userid": _this.state.user.userid,
                "userCollect.currentPage": 1,
                "userCollect.pageSize": _this.state.pageSize,
                'userCollect.etype': 5
            }
        });
        //我的喜欢 商品 资讯 帖子 事件绑定
        $(".mine-like-three-nav dd").click(function(){
            $(this).parent().find('dd.ac').removeClass('ac');
            $(this).addClass("ac");
            var name = $(this).attr('name');
            //设置当前查看的喜欢
            _this.setState({
                liketag: name
            });
            if(name === 'goods'){
                _this.setState({
                    shlist:[],
                    newslist: [],
                    reqParam:{
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 2
                    },
                    pagingUrl: Uri.person_shouchang_goods
                });
            }else if(name === 'news'){
                _this.setState({
                    shlist:[],
                    goodlist:[],
                    reqParam:{
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 1
                    },
                    pagingUrl: Uri.person_shouchang_news
                });
            }else {
                _this.setState({
                    goodlist:[],
                    newslist: [],
                    reqParam:{
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 5
                    },
                    pagingUrl: Uri.person_shouchang_bbs
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
            }else if(name === 'news'){
                _this.setState({
                    currentPage: res.currentPage,
                    newslist: isReset ? res.datas : _this.state.newslist.concat(res.datas)
                });
            }else {
                _this.setState({
                    currentPage: res.currentPage,
                    shlist: isReset ? res.datas : _this.state.shlist.concat(res.datas)
                });
            }
            callback && callback();
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
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 2
                }
            });
        }else if(name === 'news'){
            _this.setState({
                reqParam:{
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 1
                }
            });
        }else {
            _this.setState({
                reqParam:{
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 5
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
            <div className="personal-mylike-body personal-page-body">
                <div className="card">
                    <span id="itemShContent" className="control-content active">
                         
                        {
                            this.state.liketag=='bbs'?
                            <div>
                                <CommunityShareCom list={this.state.shlist} bridge={this.state.bridge}/>
                                {!this.state.shlist.length?<center>暂无数据</center>:null}
                            </div>:
                            (
                                this.state.liketag=='goods'?
                                <div className="home-page-body">
                                    <HomeProductList goods={this.state.goodlist} bridge={this.state.bridge}/>
                                    {!this.state.goodlist.length?<center>暂无数据</center>:null}
                                </div>:
                                <div className="news-list-page-body">
                                    <NewsHomeProductList newslist={this.state.newslist} bridge={this.state.bridge}/>
                                    {!this.state.newslist.length?<center>暂无数据</center>:null}
                                </div>
                            )
                        }
                    </span>
                </div>
            </div>
</PullPaging>
        );
    }
});