var GoodDetailPageHeader = React.createClass({
    getInitialState:function(){
        return {
            goodname: appTool.queryUrlParam('goodname') || '详情'
        };
    },
    render: function () {
        return (
            <div className="gooddetail-page-header">
                  <AlinkBack />
                  <a className="icon icon-compose pull-right"></a>
                  <h1 className="title">{this.state.goodname}</h1>
            </div>
        );
    }
});
var GoodDetailPageBody = React.createClass({
    getInitialState: function(){
        var banners = [];
        var _this = this,bridge = {};
        var user = appTool.getUserInfoEntity() || {};
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
        /**
         * 获取商品详情
         */
         var labels = [],goodInfo={}, goodid = appTool.queryUrlParam('goodid');
        
        return {
            totalPage: 1,
            banners:banners,
            scroll: {},
            bridge: bridge,
            labels:labels,
            pinglunlist:[],
            systemparam: appTool.getSystemParam(),//获取系统参数
            user: user,
            nomore: 2,
            goodInfo: goodInfo,
            goodid: goodid,
            buyItemId: "",
            currBuyCarGood: {},
            gustLikeGoodlist: []
        }
    },
    addToggleShowBox:function(btn, content){
        var _this = this;
        $(btn).click(function(){
            var icon = $(this).find('.icon');
            var is = icon.hasClass('icon-down');
            if(is){
                $(content).hide();
                icon.removeClass('icon-down');
                icon.addClass('icon-up');
            }else{
                $(content).show();
                icon.removeClass('icon-up');
                icon.addClass('icon-down');
            }
            _this.reloadPageScroll();//刷新scroll，更新页面尺寸
        });
    },
    componentDidMount: function(){
        var _this = this;
        //加载商品基本信息
        appTool.sendPageAjax(Uri.home_good_detail,{
            "vmgoods.userid": _this.state.user.userid || '',
            "vmgoods.id": _this.state.goodid
        },function(res){
            var temlabels = res.labels?res.labels.split(','):[];
                if(res.ptype == "1"){
                    //商品
                    banners = res.prodPics;
                }else if(res.ptype == "2"){
                    //服务
                    banners = res.insuPics;
                }else if(res.ptype == "3"){
                    //保险
                    banners = res.servPics;
                }
                _this.setState({
                    labels: temlabels,
                    goodInfo: res,
                    banners: banners || []
                });
                //初始化商品详情
                _this.initGoodDetailInfo();

        },function(err){
            iAlert(err);
        });
    },
    initGoodDetailInfo: function(){
        var _this = this;
        //商品品牌显示控制
        this.addToggleShowBox('#pinpai_title_btn','.pinpai-text');
        this.addToggleShowBox('#usedes_title_btn','.usedes-text');
        this.addToggleShowBox('#bucong_title_btn','.bucong-text');

        var pinglunurl = "",xptype = this.state.goodInfo.ptype;
        var xparam = {};
        if(xptype == "1"){
            //商品
            pinglunurl = Uri.good_pinglun_list;
            xparam = {
                "prodComment.prodid": this.state.goodInfo.psiid,
                "prodComment.currentPage": 1,
                "prodComment.pageSize": 3
            };
        }else if(xptype == "2"){
            //服务
            pinglunurl = Uri.servergood_pinglun_list;
            xparam = {
                "servComment.servid": this.state.goodInfo.psiid,
                "servComment.currentPage": 1,
                "servComment.pageSize": 3
            };
        }else if(xptype == "3"){
            //保险
            pinglunurl = Uri.insugood_pinglun_list;
            xparam = {
                "insureComment.insuid": this.state.goodInfo.psiid,
                "insureComment.currentPage": 1,
                "insureComment.pageSize": 3
            };
        }   
        //商品详情说明内容
        //dangerouslySetInnerHTML={{__html:this.state.goodInfo.memo}}
        $('#good_detail_memo').html(_this.state.goodInfo.memo);
        //重新构造图片图片路径
        $('#good_detail_memo').find('img').each(function(){
            var tmsrc = _this.state.systemparam.serverPath + $(this).attr('src');
            $(this).attr('src', tmsrc);
            $(this).attr('style', "width:100%;height:auto;display:inline;");//图片自适应
            $(this).parent().removeAttr('style');//清除父节点样式
        });
        //重新计算页面尺寸
        // setTimeout(function(){
        //     _this.state.scroll.refresh();
        // },500);
        /**
         * 获取评论列表
         */
        appTool.sendPageAjax(pinglunurl, xparam, function(res){
            _this.setState({
                nomore: res.totalPage,
                totalPage: res.totalPage,
                pinglunlist: res.datas
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },50);
        },function(err){
            console.log(err);
            // iAlert(err);
        });
        /**
         * 获取猜你喜欢列表
         */
        appTool.sendPageAjax(Uri.gust_like_data,{
            "vmgoods.delflag":0,
            "vmgoods.upstate":1,
            "vmgoods.g_delflag":0,
            "vmgoods.id": _this.state.goodInfo.id,
            "vmgoods.sotid4": _this.state.goodInfo.sotid4
        },function(res){
            _this.setState({
                gustLikeGoodlist: res
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },50);
        },function(err,status){
            // iAlert(err);
            if(status == 2){
                $('.gust-goods-loadtip').html('暂无猜你喜欢数据');
            }
        });
        /**
         * 商品浏览量统计
         */
         if(_this.state.goodInfo.ptype == '1'){
            appTool.sendPageAjax(Uri.good_count_view,{
                "vmgoods.id": _this.state.goodInfo.id
            },function(res){
                // console.log('添加访问记录成功');
            },function(err){
                iAlert(err);
            });
         }
         /**
          * 用户收藏回显
          */
         if(this.state.goodInfo.icoled){
            //用户已收藏 
            $('#shoucang_good_btn').find('.icon_heart').addClass('active');
         }else{
            $('#shoucang_good_btn').find('.icon_heart').removeClass('active');
         }
        /**
         * 收藏商品
         */
         $('#shoucang_good_btn').click(function(){
            var _dom = this;
            
            if(!(_this.state.user && _this.state.user.userid)){
                //校验登录
                appTool.playLogin(_this.state.bridge, 'gooddetail');
                return ;
            }

            if(_this.state.goodInfo.ptype == '1'){
                appTool.sendPageAjax(Uri.good_shouchang,{
                    "vmgoods.id":_this.state.goodInfo.id,
                    "vmgoods.userid": _this.state.user.userid
                },function(res){
                    var num = $(_dom).find('span').eq(0).html();
                    if($(_dom).find('.icon_heart').hasClass('active')){
                        $(_dom).find('span').eq(0).html(parseFloat(num)-1);
                    }else{
                        $(_dom).find('span').eq(0).html(parseFloat(num)+1);
                    }
                    $(_dom).find('.icon_heart').toggleClass('active');
                },function(err){
                    iAlert(err);
                });
            }
         });
         if(_this.state.user && _this.state.user.userid){
            //获取购物车里的商品列表
            //循环车里的商品，检查当前商品是否在车里
            //若在车里且没有超出购买限制，则累加，否则给出提示不进行添加
            appTool.sendPageAjax(Uri.buycar_goods_list,{
                "cartItem.userid": _this.state.user.userid,
                "cartItem.currentPage": 1,
                "cartItem.pageSize": 50
            },function(res, result){
                var arr = res.datas;
                if(arr.length){
                    for(var i = 0; i<arr.length; i++){
                        if(arr[i].mepdid == _this.state.goodid){
                            //找出购物车里的商品与当前商品匹配的
                            _this.setState({
                                buyItemId: arr[i].id,
                                currBuyCarGood: arr[i]
                            });
                            $('#count_goods_buycar').fadeOut('fast').fadeIn('fast').html(arr[i].buyqty);
                            appTool.toast('购物车里已有该商品，已为你重新计算商品数量');
                            break;
                        }
                    }
                }

            },function(err){
                // iAlert(err);
                // console.log(err);
            });
         }
         /**
          * 添加商品到购物车
          */ 
        if(_this.state.goodInfo && _this.state.goodInfo.availableqty=='0'){
            $('#add_good_buycar').addClass('over');
            $('.goods-is-nobuy').show();
        }

        $('#add_good_buycar').click(function(){
            if($(this).hasClass('over')){
                return ;
            }
            if(!(_this.state.user && _this.state.user.userid)){
                //校验登录
                appTool.playLogin(_this.state.bridge, 'gooddetail');
                return ;
            }

            var buycar = $('#count_goods_buycar').fadeOut('fast').fadeIn('fast');
            var buycargoods = parseFloat(buycar.html());
            
            if(buycargoods >3 || buycargoods==3){
                iAlert('不要贪心哇，最多买3个');
                return ;
            }
            //向购物车内添加商品
            var buyNo = buycargoods+1;
            if(buycargoods==0){
                //添加商品到购物车
                appTool.sendPageAjax(Uri.buycar_add_goods,{
                    "cartItem.userid": _this.state.user.userid,
                    "cartItem.mepdid": _this.state.goodInfo.id,
                    "cartItem.buyqty": 1
                },function(res){
                    //添加购物车后，返回购物项ID,存储id方便修改购物项
                    _this.setState({
                        buyItemId: res
                    });
                    //UI提示该商品购买数
                    buycar.html(1);
                },function(err){
                    var n = err.indexOf('_') || 0;
                    iAlert(err.substring(n+1));
                });
            }else{
                //修改购物车商品
                appTool.sendPageAjax(Uri.buycar_edit_goods,{
                    "cartItem.id": _this.state.buyItemId,//购物项的ID
                    "cartItem.mepdid": _this.state.goodInfo.id,
                    "cartItem.buyqty": buyNo
                },function(res){
                    buycar.html(buyNo);
                },function(err){
                    var n = err.indexOf('_') || 0;
                    iAlert(err.substring(n+1));
                });
            }
            
        });
        //跳转到购物车
        $('#buycar_icon_btn_go').click(function(){
            if(!(_this.state.user && _this.state.user.userid)){
                //校验登录
                appTool.playLogin(_this.state.bridge, 'gooddetail');
                return ;
            }
            var oc_url = "/pages/buycar/buycar.html";
            var iosdata = appTool.setAppData("购物车", oc_url, "buy_car");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        if(this.state.labels.length){
            $('.g-marks span').unbind('click').click(function(){
                var oname = $(this).data('oname');
                var oc_url = "/pages/mark_detail/mark_detail.html?title="+oname;
                var iosdata = appTool.setAppData(oname, oc_url, "mark_detail");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                }
            });
        }
    },
    reloadPageScroll:function(){
        var _this = this;
        setTimeout(function(){
            _this.state.scroll.refresh();
        },110);
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
        var labellist = this.state.labels.map(function(o){
            return (
                <span key={o} data-oname={o}>{o}</span>
            );
        });
        //猜你喜欢宽度
        var len = this.state.gustLikeGoodlist.length;
        var g_width = (len<4?4:len)* 36/6;

        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="good-detail-body">
                <img src="/assets/sw.png" className="goods-is-nobuy"/>
                {
                    this.state.banners.length?
                    <SwiperComponent autotime="600000" path={this.state.systemparam} banners={this.state.banners}/>:null
                }
                <div className="b-price-info box-area">
                    <b>￥{this.state.goodInfo.salestate==1? this.state.goodInfo.promprice : this.state.goodInfo.saleprice}</b>
                    <font>￥{this.state.goodInfo.refeprice}</font>
                    <button id="shoucang_good_btn" className="btn btn-link">
                        <span>{this.state.goodInfo.likenum || 0}</span>
                        <span className="icon icon-left icon_heart"></span>
                    </button>
                </div>
                <div className="good-title box-area">
                    <h1>{this.state.goodInfo.name}</h1>
                    <div className="g-marks">
                        {labellist}
                    </div>
                </div>
                <div id="good_detail_memo" className="g-desc box-area" >        
                </div>
                <div className="g-tip-promes box-area">
                    <ul>
                        <li>海外直邮</li>
                        <li>正品保障</li>
                        <li>营养师指导</li>
                        <li>30天退换</li>
                    </ul>
                </div>
                <div className="g-pinglun box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">用户评论</div>
                </div>

                <UserPingLunPart path={this.state.systemparam} goodinfo={this.state.goodInfo} nomore={this.state.nomore} list={this.state.pinglunlist} bridge={this.state.bridge}/>
                
                <div className="g-gust-like box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">猜你喜欢</div>
                </div>
                
                {
                    this.state.gustLikeGoodlist.length?
                    <div className="box-area gust-like-goods">
                        <HorizontalScroll id="h_scroller_likegoods" width={g_width + "rem"}>
                                        <HorizontalGustLikeListPart path={this.state.systemparam} list={this.state.gustLikeGoodlist} bridge={this.state.bridge}/>
                        </HorizontalScroll>
                    </div>:
                    <center className="no-data-tip gust-goods-loadtip">正在加载...</center>
                }

                <div id="pinpai_title_btn" className="g-pinglun box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">商品品牌介绍</div>
                    <span className="icon icon-up pull-right"></span>
                </div>
                <div className="pinpai-text box-area">
                    <div className="pinpai-title">
                        <div className="head-img img-box">
                            {
                                this.state.goodInfo.b_imgurl?
                                <img src={this.state.systemparam.prefix_pic_thumbnail+'/'+this.state.goodInfo.b_imgurl}/>:
                                null
                            }
                            
                        </div>
                        <div className="name">{this.state.goodInfo.b_name}</div>
                    </div>
                    <div className="desc">
                        {this.state.goodInfo.b_remark}
                    </div>
                </div>

                <div id="usedes_title_btn" className="g-pinglun box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">使用说明</div>
                    <span className="icon icon-up pull-right"></span>
                </div>
                <div className="usedes-text box-area">
                    <div className="pinpai-title">
                        <div className="head-img img-box">
                            {
                                this.state.goodInfo.imgurl?
                                <img src={this.state.systemparam.prefix_pic_thumbnail+'/'+this.state.goodInfo.imgurl}/>:
                                null
                            }
                            
                        </div>
                        <div className="name">{this.state.goodInfo.name}</div>
                    </div>
                    <div className="desc">
                        {this.state.goodInfo.prodInfo&&this.state.goodInfo.prodInfo.takemethod || '无'}
                    </div>
                </div>


                <div id="bucong_title_btn" className="g-pinglun box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">补充说明</div>
                    <span className="icon icon-up pull-right"></span>
                </div>
                <div className="bucong-text box-area">
                    <div className="bucong-title">
                        <div className="number">1</div>
                        <div className="x-title">在小陌优品购物</div>
                    </div>
                    <div className="desc">
                        “小陌优品”的产品精选自全球最热门的优质健康品、个人日护商品，采取“线上+线下”的招商采购模式，第一时间将源头采购的正品送至您手中。在下单后，您需要填写个人信息用以报关，“小陌优品”绝不会以任何方式泄露您的个人信息，请您放心。
                    </div>

                    <div className="bucong-title">
                        <div className="number two">2</div>
                        <div className="x-title">关于发货</div>
                    </div>
                    <div className="desc">
                        • 品牌直发：商品为品牌方自营，发货将由品牌方自行安排。<br/>
                        • 保税直发：“小陌优品”将由国内自营、保税仓多仓发货。<br/>
                        • 海外直发：“小陌优品”将由海外仓储直邮发货，配送周期为1~2周，具体时间因发货地具体情况而改变。
                    </div>

                    <div className="bucong-title">
                        <div className="number three">3</div>
                        <div className="x-title">关于售后</div>
                    </div>
                    <div className="desc">
                        • 30天内（自商品到达收货地址起计算）保税区与香港地区发货的商品接受无理由退货，由买家自行承担退货所产生的运费。香港地区以外的海外直邮商品，暂不接受因款式、颜色等问题所产生的退货，请您谅解。
                    </div>

                    <div className="bucong-title">
                        <div className="number four">4</div>
                        <div className="x-title">联系客服</div>
                    </div>
                    <div className="desc">
                        • 若您有任何关于订单问题的疑问，欢迎致电010-5869 9022咨询“小陌优品”。
                    </div>

                    <div className="bucong-title">
                        <div className="number five">5</div>
                        <div className="x-title">消费者告知书</div>
                    </div>
                    <div className="desc">
                        • 尊敬的用户：<br/>
                            在您选购境外商品前，请务必仔细阅读下文，您在同意下文内容后，方可下单购买：<br/>
                            1.您在“小陌优品”APP（本公司）上所选购的境外商品为产地直销商品，仅限于个人自用，不可进行二次销售。境外商品本身可能不含中文标签，建议您查看商品详情页的使用指南。如有疑问，欢迎在线联系“小陌优品”。<br/>
                            2.您所选购的境外商品适用的品质、健康、标识等项目的使用标准符合商品原产国使用标准，可能不同于我国的使用标准。在使用过程中，您需个人承担由此可能带来的危害、损失及其他风险。<br/>
                            3.您在“小陌优品”APP（本公司）上选购保税区发货的境外商品时，“小陌优品”将默认代您向海关进行申报和代缴税款。
                    </div>
                </div>

                <div className="box-area bottom-padding"></div>
            </div>
</SimplePageScroll>
        );
    }
});
var UserPingLunListData = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        var _this = this;
        var list = this.props.list.map(function(o){
            var faceUrl = _this.props.path.prefix_pic_thumbnail + '/'+o.user.faceimg;
            return (
                <ul className="share-user-info-bb" key={o.userid+Math.random()}>
                    <li>
                        <div className="head-img img-box">
                            {
                                o.user.faceimg?
                                <img src={faceUrl}/>:
                                <img src={'/assets/default_face.jpg'}/>
                            }
                        </div>
                        <div className="p-name">
                            <b>{o.user.nikename || o.user.name}</b>
                            <font>{o.addtime}</font>
                        </div>
                    </li>
                    <li><a>{o.content}</a></li>
                </ul>
            );
        });
        return (
            <div>
                {list}
            </div>
        );
    }
});

var HorizontalGustLikeListPart = React.createClass({
    componentDidMount:function(){
        var _this = this;
        //横滚猜你喜欢商品点击事件
        $('#gust_you_like_goods li').unbind('click').click(function(){
            var _xt = this;
            appTool.lazyDoit(function(){
                var oid = $(_xt).data('oid');
                var oname = $(_xt).data('oname');
                var oc_url = "/pages/gooddetail/gooddetail.html?goodid="+oid+"&goodname="+oname;
                var iosdata = appTool.setAppData(oname, oc_url, "gustlike_good_detail");
                //IOS通信回调
                appTool.sendAppData(_this.props.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.props.bridge)){
                    appTool.go(oc_url);
                }
            });
        });
    },
    render: function () {
        
        var _this = this;
        var list = this.props.list.map(function(o){
            var imgUrl = _this.props.path.prefix_pic_thumbnail + '/'+o.imgurl;
            return (
                <li key={o.id} data-oid={o.id} data-oname={o.name}>
                    <div className="img-box">
                        <img src={imgUrl}/>
                    </div>
                    <p>{o.name}</p>
                    <div className="price">
                        <span>{'￥'+o.saleprice}</span>
                        <font>{'￥'+o.refeprice}</font>
                    </div>
                </li>
            );
        });
        return (
            <ul className="product-list-part" id="gust_you_like_goods">
                {list}
            </ul>
        );
    }
});
var UserPingLunPart = React.createClass({
    componentDidMount:function(){
        var _this = this;

        $('#look_more_pinglun_btn').click(function(){
            var oc_url = "/pages/user_pinglun/user_pinglun.html?psiid="+_this.props.goodinfo.psiid+"&goodtype="+_this.props.goodinfo.ptype+"&goodid="+_this.props.goodinfo.id;
            var iosdata = appTool.setAppData("用户评论", oc_url, "user_pinglun_list");
            //IOS通信回调
            appTool.sendAppData(_this.props.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.props.bridge)){
                appTool.go(oc_url);
            }
        });

    },
    render: function () {

        return (
            <div className="ping-lun-part">
                <UserPingLunListData path={this.props.path} list={this.props.list}/>
                
                    <div className="look-more-place">
                        <a id="look_more_pinglun_btn" className="btn btn-block btn-outlined look-more" >
                        {
                            this.props.list.length?"查看更多":"亲，去评论吧~"
                        }
                        </a>
                    </div>

            </div>
        );
    }
});


