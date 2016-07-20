var newsDetailPageHeader = React.createClass({
    render: function () {
        return (
            <div className="news-detail-page-header">
                <AlinkBack />
                <h1 className="title">资讯详情</h1>
            </div>
        );
    }
});
var newsDetailPageBody = React.createClass({
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
            user: appTool.getUserInfoEntity() || {},
            systemparam: appTool.getSystemParam(),//获取系统参数
            bridge: bridge,
            news_detail_marks: [],
            pinglun: [],
            mainInfo: {},
            tuijian:{},
            gustList:[],
            scroll: {}
        }
    },
    componentDidMount: function(){
        var _this = this;
        // appTool.rmPageLoading();//页面加载完成移出提示
        /**
         * 加载资讯内容
         */
        appTool.sendPageAjax(Uri.news_item_detail,{
            "info.userid": _this.state.user.userid || '',
            "info.infoid": appTool.queryUrlParam('infoid')
        },function(res){
            _this.setState({
                mainInfo: res, //当前资讯
                tuijian: res.relationGoods || {},//相关商品
                pinglun: res.comments,//评论
                news_detail_marks: res.labels && res.labels.split(',') || []
            });
            if(!(res.relationGoods && res.relationGoods.id)){
                $('.xiangguangoods-loadtip').html('暂无相关商品');
            }
            if(res.icoled == '1'){
                //当前用户已收藏
                $('#news-xin-pinglun .xin-a').addClass('active');//初始化收藏样式
            }else{
                $('#news-xin-pinglun .xin-a').removeClass('active');//初始化删除收藏样式
            }
            $('#news-xin-pinglun .xin-a').find('span').eq(1).html(res.likenum);
            $('#news-xin-pinglun .ping-a').find('span').eq(1).html(res.commnum);
            //添加资讯内容
            $('.coustom-content').html(res.content);
            //重新构造图片图片路径
            $('.coustom-content').find('img').each(function(){
                var tmsrc = _this.state.systemparam.serverPath + $(this).attr('src');
                $(this).attr('src', tmsrc);
                $(this).attr('style', "width:100%;height:auto;display:inline;");//图片自适应
                $(this).parent().removeAttr('style');//清除父节点样式
            });
            //重新计算页面尺寸
            setTimeout(function(){
                _this.state.scroll.refresh();
            },500);
            //查看相关产品
            $('.tu-jian-news').click(function(){
                var gId = $(this).data('gid');
                var gname = $(this).data('name');
                var oc_url = "/pages/gooddetail/gooddetail.html?goodid="+gId+"&goodname="+gname;
                var iosdata = appTool.setAppData(gname, oc_url, "gooddetail");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                }
            });
            /**
             * 资讯详情-猜你喜欢(根据资讯标签查询)
             */
            appTool.sendAjax(Uri.news_gust_list,{
                "info.labels": res.labels,
                "info.currentPage":1,
                "info.pageSize": 3
            },function(res){
                _this.setState({
                    gustList: res.datas
                });
                setTimeout(function(){
                    _this.state.scroll.refresh();//刷新页面高度
                },500);
            },function(err,status){
                console.log(err,status);
            });
        });
        
        /**
         * 资讯详情-统计访问量
         */
        var userEntity = appTool.getUserInfoEntity();
        appTool.sendAjax(Uri.news_view_count,{
            "info.infoid": appTool.queryUrlParam('infoid'),
            "info.userid": userEntity&&userEntity.userid || ''
        },function(res){
            console.log("统计资讯访问成功");
        },function(err){
            console.log('统计资讯访问失败');
        });

        //喜欢切换
        $('#news-xin-pinglun .xin-a').unbind('click').click(function(){
            var user = appTool.getUserInfoEntity();
            var _this_a = this;
            
            if(!(_this.state.user && _this.state.user.userid)){
                //校验登录
                appTool.playLogin(_this.state.bridge,'news_detail');
                return ;
            }
            //添加喜欢
            appTool.sendAjax(Uri.news_my_like,{
                "info.infoid": appTool.queryUrlParam('infoid'),
                "info.userid": user.userid
            },function(res){
                var sp = $(_this_a).find('span').eq(1);
                    var n = parseFloat(sp.html());
                if($(_this_a).hasClass('active')){
                    
                    sp.html(n-1);
                }else{
                    sp.html(n+1);
                }
                $(_this_a).toggleClass('active');
            },function(err){
                iAlert(err);
            });
            
        });
        //评论列表页面
        $('#news-xin-pinglun .ping-a').click(function(){
            var oc_url = '/pages/user_pinglun/user_pinglun.html?infoid='+appTool.queryUrlParam('infoid');
            var iosdata = appTool.setAppData("评论列表", oc_url, "user_pinglun");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        window._page_iscroll_entity = scroll;//缓存页面scroll对象
        setTimeout(function(){
            scroll.refresh();
        },500);
    },
    render: function () {
        //顶部大banner图
        var mInfoUrl = this.state.systemparam.prefix_pic_thumbnail+'/'+this.state.mainInfo.imgurl;
        //相关商品图
        // var tuijianUrl = this.state.systemparam.prefix_pic+'/'+this.state.tuijian.imgurl;
        var tempprodpics = this.state.tuijian.prodPics || [];
        var tempTurl = "";
        if(tempprodpics.length){
            //获取商品相册第一个图片
            tempTurl = tempprodpics[0].imgurl;
        }
        var tuijianUrl = this.state.systemparam.prefix_pic_thumbnail+'/'+tempTurl;
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="news-detail-body">
                <div className="img-box top-banner">
                    {
                        this.state.mainInfo.imgurl? 
                        <img src={mInfoUrl}/>:
                        null
                    }
                    <p>{this.state.mainInfo.title}</p>
                    <a href="#"></a>
                </div>
                <NewsDetailPageMarks bridge={this.state.bridge} list={this.state.news_detail_marks}/>
                
                <div className="coustom-content"> </div>

                <div className="g-xiang-like box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">相关产品</div>
                </div>
                {
                    this.state.tuijian.id?
                    <div className="tu-jian-news" data-gid={this.state.tuijian.id} data-name={this.state.tuijian.name}>
                        <div className="img-box">
                            {
                                tempTurl? 
                                <img src={tuijianUrl}/>:
                                null
                            }
                            
                        </div>
                        <div className="news-price">
                            <div className="red-price">{"￥"+ (this.state.tuijian.saleprice || 0)}</div>
                            <div className="hot-people">{this.state.tuijian.likenum || 0}人喜欢</div>
                            <a id="look_good_det_mobtn" data-gid={this.state.tuijian.id} data-name={this.state.tuijian.name}>查看详情</a>
                        </div>
                    </div>:
                    <center className="no-data-tip xiangguangoods-loadtip">正在加载...</center>
                }
                


                <div className="g-gust-like box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">猜你喜欢</div>
                </div>
                <NewsGustList path={this.state.systemparam} goodinfo={this.state.mainInfo} list={this.state.gustList} bridge={this.state.bridge}/>
            </div>
</SimplePageScroll>
        );
    }
});

var NewsDetailPageMarks = React.createClass({
    showmarkdetail:function(e){
        var _this = this;
        var oname = $(e.target).data('oname');
        var oc_url = "/pages/mark_detail/mark_detail.html?title="+oname;
        var iosdata = appTool.setAppData(oname, oc_url, "mark_detail");
        //IOS通信回调
        appTool.sendAppData(_this.props.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.props.bridge)){
            appTool.go(oc_url);
        }
    },
    render: function () {
        var _this = this;
        var list = this.props.list.map(function(o){
            var url = "/pages/mark_detail/mark_detail.html?title="+o;
            var linkdata = appTool.setAppData(o, url, "mark_detail");
            return (
                <li key={Math.random()}>
                    <a onClick={_this.showmarkdetail} data-oname={o}>{o}</a>
                </li>
            );
        });
        return (
            <ul className="marks-part-area">
                {list}
            </ul>
        );
    }
});
var NewsGustList = React.createClass({
    shownewsdetail:function(e){
        var _this = this;
        var oc_url = $(e.target).data('href');
        var title = $(e.target).data('title');
        var iosdata = appTool.setAppData(title, oc_url, "share");
        //IOS通信回调
        appTool.sendAppData(_this.props.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.props.bridge)){
            appTool.go(oc_url);
        }
    },
    render: function () {
        var _this = this;
        var pInfoId = this.props.goodinfo.infoid || '';
        var list = this.props.list.map(function(o){
            if(pInfoId == o.infoid)return null; //猜你喜欢 和当前资讯相同的排除
            var url = '/pages/news_detail/news_detail.html?infoid='+o.infoid;
            // var linkdata = appTool.setAppData(o.title, url, "news_detail");
            var imgUrl = _this.props.path.prefix_pic_thumbnail +"/"+o.imgurl; 
            return (
                <div className="img-box gust-news" key={Math.random()}>
                    {o.imgurl?<img src={imgUrl}/>:null}
                    <p>{o.title}</p>
                    <a onClick={_this.shownewsdetail} data-title={o.title} data-href={url}></a>
                </div>
            );
        });
        return (
            <div className="gust-list">
                {list}
            </div>
        );
    }
});
