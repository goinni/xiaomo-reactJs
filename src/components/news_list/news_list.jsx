var NewsListPageHeader = React.createClass({
    getInitialState: function(){
        appTool.iframePageInit();
        return {};
    },
    render: function () {
        return (
            <div className="news-list-page-header">
                <AlinkBack />
                <h1 className="title">资讯列表</h1>
            </div>
        );
    }
});
var NewsListPageBody = React.createClass({
    getInitialState: function(){
        
        return {
            currentPage: 1,
            pageSize: 10,
            newslist:[],
            bridge:{}
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.news_good_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                newslist: isReset ? res.datas : _this.state.newslist.concat(res.datas)
            });
            //下拉刷新上拉加载回调用
            callback && callback();
        },function(err){
            iAlert(err);
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
    },
    onPullDown: function(paging){
        var _this = this;
        //下拉刷新
        this.loadPagingData({
            "info.currentPage": 1,
            "info.pageSize": this.state.pageSize
        }, true, function(){
            setTimeout(function(){paging.refresh();},500);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    onPullUp: function(paging){
        var _this =this;
        //上拉加载下一页数据
        this.loadPagingData({
            "info.currentPage": this.state.currentPage+1,
            "info.pageSize": this.state.pageSize
        }, false, function(){
            setTimeout(function(){paging.refresh();},100);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },

    render: function () {
        
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
                <NewsHomeProductList newslist={this.state.newslist} bridge={this.state.bridge}/>
            </PullPaging>
        );
    }
});


var NewsListProductList = React.createClass({

    render: function(){
        var _this = this;
        var lis = this.props.newslist.map(function(o){
                var url = "/pages/news_detail/news_detail.html?infoid="+o.infoid;
                var linkdata = appTool.setAppData(o.name, url, "newslist");
                return (
                    <li className="img-box top-banner" key={o.id*Math.random()}>
                        <img src={o.imgUrl}/>
                        <p>{o.name}</p>
                        <div className="like">
                            {o.likenum}
                        </div>
                        <Alink href={url} data={linkdata} bridge={_this.props.bridge}></Alink>
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
