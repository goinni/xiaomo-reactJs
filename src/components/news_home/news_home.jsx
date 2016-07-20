var NewsHomePageHeader = React.createClass({
    componentDidMount:function(){
    },
    onSearchEv: function(){
        //搜索事件
    },
    render: function () {
        return (
            <div className="news-home-page-header">
                <a onTouchStart={this.onSearchEv} href="/pages/search/search.html" data-transition="slide-out" className="icon icon-search pull-left"></a>
                <a href="/pages/notiylist/notiylist.html" data-transition="slide-in" className="icon icon-more pull-right"></a>
                <h1 className="title">资讯</h1>
            </div>
        );
    }
});
var NewsHomePageBody = React.createClass({
    getInitialState: function(){
        
        return {
            user: appTool.getUserInfoEntity() || '',
            systemparam: appTool.getSystemParam(),//获取系统参数
            msgcount: 0,
            currentPage: 1,
            pageSize: 10,
            newslist:[],
            topBanner:{},
            bridge:{}
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        //加载资讯列表
        appTool.sendPageAjax(Uri.news_good_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                newslist: isReset ? res.datas : _this.state.newslist.concat(res.datas)
            });
            //下拉刷新上拉加载回调用
            callback && callback();
        },function(err, stauts){
            if(stauts == 2){
                //无数据
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
            }
        });
    },
    componentDidMount: function(){
        var _this =this;
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
        });
        //加载Banner数据
        appTool.sendAjax(Uri.home_banner,{
            "banner.currentPage":1,
            "banner.pageSize": 10,
            "banner.position": 2 //资讯
        },function(res){
            if(res && res.length){
                _this.setState({
                    topBanner: res[0]
                });
            }
        },function(err){
            // iAlert("banner loaded error");
        });
        // 获取用户消息通知总个数
        if(_this.state.user){
            appTool.sendAjax(Uri.notify_msg_count,{
                "sysMsg.userid": _this.state.user.userid
            },function(res){
                _this.setState({
                    msgcount: res
                });
            },function(err){
                iAlert(err);
            });
        }
        /**
         * 跳转至搜索页面
         */
        $('#go_search_page_btn').unbind('click').click(function(){
            var oc_url = "/pages/search/search.html";
            var iosdata = appTool.setAppData("资讯搜索", oc_url, "search_newsinfo");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        /**
         * 跳转至系统消息页面
         */
        $('#go_sysmsg_page_btn').unbind('click').click(function(){
            //设置消息数据为 0 
            _this.setState({
                msgcount: 0
            });
            var oc_url = "/pages/notiylist/notiylist.html";
            var iosdata = appTool.setAppData("通知", oc_url, "message_list");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        //顶部最大banner点击事件
        $('#top_banner_btn').click(function(){
            // var oc_url = "/pages/news_detail/news_detail.html?infoid="+_this.state.topBanner.infoid;
            var oc_url = _this.state.topBanner.linkurl;
            var iosdata = appTool.setAppData(_this.state.topBanner.title, oc_url, "newslistBanner");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
    },
    onPullDown: function(paging){
        $('.new-homesearch-tip-bar').fadeOut();//搜索半透明工具条隐藏
        this.setState({
            scroll: paging
        });
        //下拉刷新
        this.loadPagingData({
            "info.currentPage": 1,
            "info.pageSize": this.state.pageSize
        }, true, function(){
            setTimeout(function(){
                $('.new-homesearch-tip-bar').fadeIn();//搜索半透明工具条显示
                paging.refresh();
            },700);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "info.currentPage": this.state.currentPage+1,
            "info.pageSize": this.state.pageSize
        }, false, function(){
            setTimeout(function(){paging.refresh();},100);
        });
    },
    onScrollMove: function(o){
        if(o.y > -30){
            $('.new-homesearch-tip-bar').fadeOut();
        }
    },
    onTouchEnd: function(o){
        if(o.y === -40){
            $('.new-homesearch-tip-bar').fadeIn();
        }
    },
    render: function () {
        var topImgUrl = this.state.systemparam.prefix_pic_thumbnail + '/' + this.state.topBanner.imgurl;
        return (
            <PullPaging onScrollTouchEnd={this.onTouchEnd} onScrollMove={this.onScrollMove} onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
                <div className="new-homesearch-tip-bar">
                    <div className="s-bok" id="go_search_page_btn">
                        <div className="s-b-icon"></div>
                        <div className="s-b-text">搜索关键词</div>
                    </div>
                    <div className="msg-tip" id="go_sysmsg_page_btn">
                        {
                            this.state.msgcount? <div className="s-b-num">{this.state.msgcount}</div> : null
                        }
                    </div>
                </div>
                <div className="img-box top-banner">
                    {
                        this.state.topBanner.imgurl?
                        <img src={topImgUrl}/>:
                        null
                    }
                    <p>{this.state.topBanner.title}</p>
                    
                    <a id="top_banner_btn"></a>
                </div>
                <NewsHomeProductList path={this.state.systemparam} newslist={this.state.newslist} bridge={this.state.bridge}/>
            </PullPaging>
        );
    }
});


var NewsHomeProductList = React.createClass({
    acNewsDetailInfo: function(e){
        //查看资讯详情
        var _this = this;
        var dom = $(e.target);
        var href = dom.data('href');
        var title = dom.data('title');
        var linkdata = appTool.setAppData(title, href, "share");

        //IOS通信回调
        appTool.sendAppData(_this.props.bridge, linkdata);
        if(!appTool.hasAppBridge(_this.props.bridge)){
            appTool.go(href);
        }
    },
    render: function(){
        var _this = this;
        var lis = this.props.newslist.map(function(o){
                var url = '/pages/news_detail/news_detail.html?infoid='+(o.infoid || o.entityid);
                // var linkdata = appTool.setAppData(o.title, url, "share");
                var imgUrl = _this.props.path.prefix_pic_thumbnail+'/'+o.imgurl;//构造图片地址

                return (
                    <li className="img-box top-banner" key={(o.infoid || o.entityid)+Math.random()}>
                        <img onClick={_this.acNewsDetailInfo} data-title={o.title} data-href={url} src={imgUrl}/>
                        <p onClick={_this.acNewsDetailInfo} data-title={o.title} data-href={url}>{o.title}</p>
                        {
                            o.infoid?
                            <div className="like">
                                {o.likenum || 0}
                            </div>: null
                        }
                    </li>
                );
        });
        return (
            <ul className="news-product-list">
             {lis}
            </ul>
        );
    }
});
