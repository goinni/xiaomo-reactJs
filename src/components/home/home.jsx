var HomePageHeader = React.createClass({
    componentDidMount:function(){
    },
    onSearchEv: function(){
        //搜索事件
        //删除智推按钮
        $('.icon-btn-push-goods').remove();
    },
    render: function () {
        return (
            <div className="home-page-header">
                <a onTouchStart={this.onSearchEv} href="/pages/search/search.html" data-transition="slide-out" className="icon icon-search pull-left"></a>
                <a className="icon icon-more pull-right"></a>
                <h1 className="title">小陌优品</h1>
            </div>
        );
    }
});
var HomePageBody = React.createClass({
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
        //加载Banner数据
        appTool.sendAjax(Uri.home_banner,{
            "banner.currentPage":1,
            "banner.pageSize": 10,
            "banner.position": "" //banner
        },function(res){
            banners = res;
        },function(err){
            iAlert("banner loaded error");
        },null,null,false);

        return {
            systemparam: appTool.getSystemParam(),//获取系统参数
            banners: banners,
            currentPage: 1,
            pageSize: 10,
            goods:[],
            homemarks: [],
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
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
            }
        });
    },
    componentDidMount: function(){
        var _this =this;
        appTool.sendAjax(Uri.home_marks,{},function(res){
            _this.setState({
                homemarks: res.datas
            });
        },function(err){
            iAlert(err);
        });
        /**
         * 智推按钮
         */
        $('.icon-btn-push-goods').remove();
        $('<a>').attr({
            "class": 'icon-btn-push-goods'
        }).appendTo('body');
        //个人自测
        $('.icon-btn-push-goods').click(function(){
            var oc_url = "/pages/zc_home/zc_home.html";
            var iosdata = appTool.setAppData("个人自测", oc_url, "zc_home");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
    },
    onPullDown: function(paging){
        this.setState({
            scroll: paging
        });
        //下拉刷新
        this.loadPagingData({
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
                <SwiperComponent path={this.state.systemparam} banners={this.state.banners}/>
                <HomeProductMarks bridge={this.state.bridge} list={this.state.homemarks}/>
                <HomeProductList path={this.state.systemparam} goods={this.state.goods} bridge={this.state.bridge}/>
            </PullPaging>
        );
    }
});


var HomeProductList = React.createClass({
    acGoodDetailInfo: function(e){
        //查看资讯详情
        var _this = this;
        console.log(e);
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
        var lis = this.props.goods.map(function(o){
                var url = "/pages/gooddetail/gooddetail.html?goodid="+(o.id || o.entityid)+"&goodname="+(o.name || o.title);
                // var linkdata = appTool.setAppData(o.name || o.title, url, "share");
                var imgUrl = _this.props.path.prefix_pic + '/'+o.imgurl;
                // console.log(o);
                return (
                    <li key={(o.id || o.entityid)+Math.random()}>
                        <div className="img-box">
                            <img src={imgUrl}/>
                        </div>
                        <p>{o.name || o.title}</p>
                        <div className="price">
                            <span>{'￥'+o.saleprice || 0}</span>
                            <font>{'￥'+o.refeprice || 0}</font>
                        </div>
                        <div className="small-count-part">
                            <button className="btn btn-link">
                              <span className="icon icon_heart"></span>
                              {o.likenum || 0}
                            </button>
                            <button className="btn btn-link">
                              <span className="icon icon_speak"></span>
                              {o.commnum || 0}
                            </button>
                        </div>
                        <a onClick={_this.acGoodDetailInfo} data-title={o.name || o.title} data-href={url} className={o.availableqty=='0' ?'short-supply-over': null}></a>
                    </li>
                );
        });
        return (
            <ul className="product-list-part">
             {lis}
            </ul>
        );
    }
});

var HomeProductMarks = React.createClass({
    render: function(){
        var _this = this;
        var lis = this.props.list.map(function(o){
                var url = "/pages/mark_detail/mark_detail.html?title="+o.name;
                var linkdata = appTool.setAppData(o.name, url, "mark_detail");
                return (
                    <li key={o.id} className="btn btn-primary btn-outlined">
                        {o.name}
                        <Alink href={url} data={linkdata} bridge={_this.props.bridge}></Alink>
                    </li>
                );
        });
        return (
            <ul className="marks-area-box">
                {lis}
            </ul>
        );
    }
});