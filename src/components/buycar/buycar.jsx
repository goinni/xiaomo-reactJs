var BuycarPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="buycar-page-header">
                <AlinkBack />
                <h1 className="title">购物车</h1>
            </div>
        );
    }
});
var BuycarPageBody = React.createClass({
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
            systemparam: appTool.getSystemParam(),//获取系统参数
            user: appTool.getUserInfoEntity(),
            buycarInfo: {},
            scroll: {},
            bridge: bridge,
            list: []
        }
    },
    componentDidMount: function(){
        var _this = this;
        // 生成订单并跳转到订单确认页面
        iAlert({
            text: "正在创建订单",
            btnshow: false
        });
        $("#go_create_order_confirm_order").click(function(){
            // 创建订单
            // 订单创建成功后跳转到订单确认页面
            appTool.sendAjax(Uri.order_action_create,{
                "prodOrder.userid": _this.state.user.userid
            },function(res){
                iAlert({
                        text: "订单创建成功!",
                        btnshow: false,
                        autoClosed: 1000,
                    });
                //跳转到订单确认页面
                setTimeout(function(){
                    var oc_url = "/pages/confirm_order/confirm_order.html?ordernum="+res;
                    var iosdata = appTool.setAppData("订单确认", oc_url, "confirm_order");
                    //IOS通信回调
                    appTool.sendAppData(_this.state.bridge, iosdata);
                    //ios若处理跳转这里可以忽略
                    if(!appTool.hasAppBridge(_this.state.bridge)){
                        appTool.go(oc_url);
                    }
                },300);
            },function(err,status){
                if(status == '2'){
                    var n = err.indexOf('_') || 0;
                    iAlert(err.substring(n+1));
                }else{
                    iAlert(err);                    
                }
            });
        });
        //加载购物车商品列表
        _this.getBuycarData();
        //数据加载完成后 加载删除提示
        appTool.rmPageLoading();
    },
    getBuycarData: function(){
        var _this = this;
        if(_this.state.user && _this.state.user.userid){
            //获取购物车里的商品列表
            //循环车里的商品，检查当前商品是否在车里
            //若在车里且没有超出购买限制，则累加，否则给出提示不进行添加
            appTool.sendAjax(Uri.buycar_goods_list,{
                "cartItem.userid": _this.state.user.userid,
                "cartItem.currentPage": 1,
                "cartItem.pageSize": 50
            },function(res, result){

                _this.setState({
                    buycarInfo: result,
                    list: res.datas
                });
                //实际需要支付的钱
                $('#total_money_value').html(result.cart.totalSellPrice);
                //为你省 了的钱
                $('#total_savemoney_value').html(result.cart.totalSavedPrice);
            },function(err, status){
                if(status == '2'){
                    iAlert('亲，去购物吧~');
                    _this.setState({
                        buycarInfo: {},
                        list: []
                    });
                    //实际需要支付的钱
                    $('#total_money_value').html('00.00');
                    //为你省 了的钱
                    $('#total_savemoney_value').html('00.00');
                }else{
                    iAlert(err || '获取购物车商品数据异常');                    
                }
            });
         }else{
            //没有登录
            appTool.playLogin(_this.state.bridge, 'buycar');
         }
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    changeBuycar: function(buycar, buyItemId, mepdid, buyNo,calllback){
        //修改购物车商品
        appTool.sendAjax(Uri.buycar_edit_goods,{
            "cartItem.id": buyItemId,//购物项的ID
            "cartItem.mepdid": mepdid,
            "cartItem.buyqty": buyNo
        },function(res){
            buycar.html(buyNo);
            calllback && calllback();
        },function(err,status){
            if(status == 2){
                var n = err.indexOf('_') || 0;
                iAlert(err.substring(n+1));
            }else{
                iAlert(err);
            }
        });
    },
    onJian: function(e){
        var _this = this;
        var conut = $(e.target).parent().find('.count');
        var buyItemId = $(e.target).parent().data('itemid'); 
        var mepdid = $(e.target).parent().data('mepdid');
        var n = parseInt(conut.html());

        if(n<=0){
            n=0;
        }else{
            --n;
            //请求修改购物车
            this.changeBuycar(conut, buyItemId, mepdid, n, function(){
                //刷新加载购物车商品列表
                _this.getBuycarData();
            });
        }
    },
    onJia: function(e){
        var _this = this;
        var conut = $(e.target).parent().find('.count');
        var buyItemId = $(e.target).parent().data('itemid'); 
        var mepdid = $(e.target).parent().data('mepdid');
        var n = parseInt(conut.html());

        if(n>2){
            iAlert('亲,别贪心,最多买3个哇~');
        }else{
            ++n;
            //请求修改购物车
            this.changeBuycar(conut, buyItemId, mepdid, n, function(){
                //刷新加载购物车商品列表
                _this.getBuycarData();
            });
        }
    },
    onDel: function(e){
        var _this = this;
        var _dom = $(e.target);
        var buyItemId = _dom.parent().data('itemid'); 
        iAlert({
            text: "亲，确定要删除嘛？",
            confirm: true,
            callback: function(){
                iAlert({
                    text: "正在删除",
                    btnshow: false
                });
                //删除购物车商品
                appTool.sendAjax(Uri.buycar_del_goods,{
                    "cartItem.id": buyItemId
                },function(res){
                    //删除成功后重新刷新加载购物车商品列表
                    _this.getBuycarData();
                    iAlert({
                        text: "删除成功",
                        btnshow: false,
                        autoClosed: 1000,
                    });
                },function(err){
                    iAlert(err);
                });
            }
        });
        
    },
    render: function () {
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="buycar-body">
                <BuycarGoodsData path={this.state.systemparam} bridge={this.state.bridge} onJian={this.onJian} onJia={this.onJia} onDel={this.onDel} list={this.state.list}/>
            </div>
</SimplePageScroll>
        );
    }
});
var BuycarGoodsData = React.createClass({
    acBGoodDetailInfo: function(e){
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
    render: function () {
        var _this = this;
        var list = this.props.list.map(function(o){
            var price = 0;
            var url = "/pages/gooddetail/gooddetail.html?goodid="+o.vmGoods.id+"&goodname="+o.vmGoods.name;
            // var linkdata = appTool.setAppData(o.name, url, "good_detail");
            //计算每个购物项的价格
            if(o.vmGoods.salestate=='1'){
                price = parseFloat(o.vmGoods.promprice)*parseFloat(o.buyqty);
            }else{
                price = parseFloat(o.vmGoods.saleprice)*parseFloat(o.buyqty);
            }
            //商品图片
            var imgUrl = _this.props.path.prefix_pic+'/'+o.vmGoods.imgurl;
            return (
                <li key={o.id+Math.random()}>
                    <div className='img-box'>
                        <a>
                            <img data-href={url} data-title={o.vmGoods.name} onClick={_this.acBGoodDetailInfo} src={imgUrl}/>
                        </a>
                    </div>
                    <div className='right'>
                        <a>
                            <div className='tex' >
                                <span data-title={o.vmGoods.name} data-href={url} onClick={_this.acBGoodDetailInfo}>{o.vmGoods.name}</span>
                                {o.availableqty=='0'?<b>库存不足</b>:null}
                            </div>
                        </a>
                        <div className='hdl'>
                            <b>￥<font>{price.toFixed(2)}</font></b>
                            {
                                _this.props.noedit != '1'?
                                <div className="jia-jian-count" data-itemid={o.id} data-mepdid={o.mepdid}>
                                    <div className="jian" onClick={_this.props.onJian}>{'-'}</div>
                                    <div className="count">{o.buyqty}</div>
                                    <div className="jia" onClick={_this.props.onJia}>{'+'}</div>
                                </div>:null
                            }
                            {
                               _this.props.noedit != '1'?
                                <div className='del' data-itemid={o.id} data-mepdid={o.mepdid}>
                                    <span className="icon icon-trash" onClick={_this.props.onDel}></span>
                                </div>:null
                            }
                            {
                               _this.props.noedit != '1'?
                                null:<strong>{o.buyqty}</strong>
                            }
                        </div>
                    </div>
                </li>
            );
        });
        return (
            <ul className='order-list'>
                {list}
            </ul>
        );
    }
});


