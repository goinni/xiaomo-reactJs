var NewsPageHeader = React.createClass({
    render: function () {
        return (
            <div className="news-page-header">
                <a href="/pages/search/search.html" data-transition="slide-out" className="icon icon-search pull-left"></a>
                <a className="icon icon-more pull-right"></a>
                <h1 className="title">资讯</h1>
            </div>
        );
    }
});
var NewsPageBody = React.createClass({
    getInitialState: function(){
        var _this = this,
            banners = [];
        appTool.sendAjax(Uri.news_banner,{},function(res){
            banners = res.datas;
        },function(err){
            iAlert("banner loaded error");
        },null,null,false);
        return {
            banners: banners,
            goods:[]
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.news_good_list,opt,function(res){
            _this.setState({
                goods: isReset ? res.datas : _this.state.goods.concat(res.datas)
            });
            callback && callback();
        });
    },
    componentDidMount: function(){
    },
    onPullDown: function(paging){
        //下拉刷新
        this.loadPagingData({},true, function(){
            setTimeout(function(){paging.refresh()},500);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({},false,function(){
            paging.refresh();
        });
    },
    render: function () {
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
                <SwiperComponent banners={this.state.banners}/>
                <NewsProductList goods={this.state.goods}/>
            </PullPaging>
        );
    }
});

var NewsProductList = React.createClass({
    
    render: function(){
        var lis = this.props.goods.map(function(o){
                return (
                    <li key={o.id*Math.random()}>
                        <div className="img-box">
                            <img src={o.imgUrl}/>
                        </div>
                        <a href='/pages/news_detail/news_detail.html'></a>
                    </li>
                );
        });
        return (
                <ul className="news-product">
                 {lis}
                </ul>
        );
    }
});

