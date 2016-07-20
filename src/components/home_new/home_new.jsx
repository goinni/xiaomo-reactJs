var HomeNewPageHeader = React.createClass({
    componentDidMount:function(){
    },
    onSearchEv: function(){
        //搜索事件
        //删除智推按钮
        $('.icon-btn-push-goods').remove();
    },
    render: function () {
        return (
            <div className="home-new-page-header">
                <a onTouchStart={this.onSearchEv} href="/pages/search/search.html" data-transition="slide-out" className="icon icon-search pull-left"></a>
                <a className="icon icon-more pull-right"></a>
                <h1 className="title">小陌优品</h1>
            </div>
        );
    }
});
var HomeNewPageBody = React.createClass({
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
        // //加载Banner数据
        // appTool.sendAjax(Uri.home_banner,{
        //     "banner.currentPage":1,
        //     "banner.pageSize": 6,
        //     "banner.position": "" //banner
        // },function(res){
        //     banners = res;
        // },function(err){
        //     iAlert("banner loaded error");
        // },null,null,false);

        return {
            user: appTool.getUserInfoEntity() || '',
            systemparam: appTool.getSystemParam(),//获取系统参数
            banners: banners,
            hostGoodlist: [],//热门商品
            currentPage: 1,
            pageSize: 8,
            searchMark: '',
            goods:[],
            scroll: {},
            homemarks: [],
            msgcount: 0,//通知个数
            bridge: bridge
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.home_good_list_bylables,opt,function(res){
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
        // 获取用户消息通知总个数
        // if(_this.state.user && !_this.state.msgcount){
        //     appTool.sendAjax(Uri.notify_msg_count,{
        //         "sysMsg.userid": _this.state.user.userid
        //     },function(res){
        //         _this.setState({
        //             msgcount: res
        //         });
        //     },function(err){
        //         iAlert(err);
        //     });
        // }
    },
    componentDidMount: function(){
        var _this =this;
        //加载Banner数据
        appTool.sendAjax(Uri.home_banner,{
            "banner.currentPage":1,
            "banner.pageSize": 6,
            "banner.position": "" //banner
        },function(res){
            _this.setState({
                banners: res
            });
        },function(err){
            iAlert("banner loaded error");
        });
        // 获取热门标签
        appTool.sendAjax(Uri.home_marks,{},function(res){
            _this.setState({
                homemarks: res.datas
            });
            //热门标签
            $('.new-marks-area-box li').unbind('click').click(function(){
                $('.new-marks-area-box li.active').removeClass('active');
                $(this).addClass('active');
                //设置搜索过虑的标签名
                _this.setState({
                    searchMark: $(this).html()
                });
                _this.onPullDown(_this.state.scroll);
                //在300毫秒内Y轴向下滚动10像素
                var height = $('.swiper-wrapper img').eq(0).css('height');
                if(height){
                    height = parseFloat(height) + 20;
                }
                _this.state.scroll.scrollTo(0, -height, 400);
            });
        },function(err){
            iAlert(err);
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
         * 获取热门商品列表
         */
        appTool.sendPageAjax(Uri.home_hot_good_list,{
            // "vmgoods.shortsupply":0,
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,
            "vmgoods.currentPage":1,
            "vmgoods.pageSize": 6
        },function(res){
            _this.setState({
                hostGoodlist: res.datas
            });
            //横滚热门商品点击事件
            $('.product-list-part li').unbind('click').click(function(){
                var _xt = this;
                appTool.lazyDoit(function(){
                    var oid = $(_xt).data('oid');
                    var oname = $(_xt).data('oname');
                    var oc_url = "/pages/gooddetail/gooddetail.html?goodid="+oid+"&goodname="+oname;
                    var iosdata = appTool.setAppData(oname, oc_url, "share");
                    //IOS通信回调
                    appTool.sendAppData(_this.state.bridge, iosdata);
                    if(!appTool.hasAppBridge(_this.state.bridge)){
                        appTool.go(oc_url);
                    }
                });
            });
        },function(err){
            // iAlert(err);
            $('.host-good-list-tip').html('暂无热门商品');
        });
        //查看更多商品
        $('.look-more-goods').unbind('click').click(function(){
            var oc_url = "/pages/goodlist/goodlist.html";
            var iosdata = appTool.setAppData("商品列表", oc_url, "goodlist");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
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
        /**
         * 跳转至搜索页面
         */
        $('#go_search_page_btn').unbind('click').click(function(){
            var oc_url = "/pages/search/search.html";
            var iosdata = appTool.setAppData("商品搜索", oc_url, "search");
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
    },
    onPullDown: function(paging){
        $('.new-homesearch-tip-bar').fadeOut();//搜索半透明工具条隐藏
        this.setState({
            scroll: paging
        });
        //下拉刷新
        this.loadPagingData({
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,

            "vmgoods.name":"",
            "vmgoods.labels": this.state.searchMark,
            "vmgoods.currentPage": 1,
            "vmgoods.pageSize": this.state.pageSize
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
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,

            "vmgoods.name":"",
            "vmgoods.labels": this.state.searchMark,
            "vmgoods.currentPage": this.state.currentPage+1,
            "vmgoods.pageSize": this.state.pageSize
        }, false, function(){
            paging.refresh();
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
    swiperOnClick: function(swiper){
        var _this = this;
        var dom = $(swiper.clickedSlide);
        var href = dom.data('href');
        var title = dom.data('title');
        //banner地址存在则跳转
        if(href){
            var oc_url = href;
            var iosdata = appTool.setAppData(title, oc_url, "banner_detail");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }  
        }
    },
    render: function () {
        var len = this.state.hostGoodlist.length;
        var g_width = ((len<4?4:len)* 7.625);
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
                {
                    this.state.banners.length?
                    <SwiperComponent onClick={this.swiperOnClick} path={this.state.systemparam} banners={this.state.banners}/>:null
                }
                
                <HomeNewProductMarks bridge={this.state.bridge} list={this.state.homemarks}/>
                <div className="s-title-bar">
                    <div className="ll-bg"></div>
                    <div className="ll-name">商城</div>
                    <div className="ll-more look-more-goods">
                        查看更多
                        <span className="icon icon-right-nav"></span>
                    </div>
                </div>
                <div className="s-hot-goods">
                    {
                        this.state.hostGoodlist.length?
                        <HorizontalScroll id="h_scroller_hotgoods" width={g_width + "rem"}>
                                        <HorizontalHotGoodListPart path={this.state.systemparam} list={this.state.hostGoodlist} bridge={this.state.bridge}/>
                        </HorizontalScroll>:
                        <center className="no-data-tip host-good-list-tip">正在加载...</center>
                    }
                </div>
                <HomeNewProductList path={this.state.systemparam} goods={this.state.goods} bridge={this.state.bridge}/>
            </PullPaging>
        );
    }
});


var HomeNewProductList = React.createClass({

    render: function(){
        var _this = this;
        var n = 0;
        var lis = this.props.goods.map(function(o){
                var url = "/pages/gooddetail/gooddetail.html?goodid="+(o.id || o.entityid)+"&goodname="+(o.name || o.title);
                var linkdata = appTool.setAppData(o.name || o.title, url, "share");
                var imgUrl = _this.props.path.prefix_pic_thumbnail + '/'+o.imgurl;
                var imgUrlBig = _this.props.path.prefix_pic_thumbnail + '/'+o.imgurl3;
                var isBigImg = (n%4 == '0');//大图显示
                ++n;
                return (
                    <li key={(o.id || o.entityid)+Math.random()} className={isBigImg?'big-img':null}>

                        {
                            isBigImg?
                            <div className="img-box">
                                {o.imgurl3?<img src={imgUrlBig}/>:<center>缺少商品大图</center>}
                            </div>:
                            <div className="img-box">
                                {o.imgurl? <img src={imgUrl}/> :<center>缺少商品图片</center>} 
                            </div>
                        }
                        {
                            !isBigImg?<h4>{'￥'+o.saleprice}</h4>:null
                        }
                        {
                            !isBigImg?<p>{o.name || o.title}</p>:null
                        }
                        <Alink className={o.availableqty=='0' ?'short-supply-over': null} href={url} data={linkdata} bridge={_this.props.bridge}></Alink>
                    </li>
                );
        });
        return (
            <ul className="product">
             {lis}
            </ul>
        );
    }
});

var HomeNewProductMarks = React.createClass({
    render: function(){
        var _this = this;
        var lis = this.props.list.map(function(o){
                return (
                    <li key={o.id}>
                        {o.name}
                    </li>
                );
        });
        return (
            <ul className="new-marks-area-box">
                {lis}
            </ul>
        );
    }
});
var HorizontalHotGoodListPart = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        
        var _this = this;
        var list = this.props.list.map(function(o){
            var imgUrl = _this.props.path.prefix_pic_thumbnail + '/'+o.imgurl;
            return (
                <li key={o.id} data-oid={o.id} data-oname={o.name}>
                    <div className="img-box">
                        {
                            o.imgurl? <img src={imgUrl}/>: null
                        }
                        
                    </div>
                    <p>{o.name}</p>
                    <div className="price">
                        <span>{"￥"+o.saleprice || 0}</span>
                        <font>{"￥"+ (o.refeprice==null? 0 : o.refeprice)}</font>
                    </div>
                </li>
            );
        });
        return (
            <ul className="product-list-part">
                {list}
            </ul>
        );
    }
});