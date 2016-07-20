var MyOrderPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="myorder-page-header">
                    <AlinkBack />
                    <h1 className="title">订单列表</h1>
            </div>
        );
    }
});
var MyOrderPageBody = React.createClass({
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
            currentPage: 1,
            pageSize: 10,
            scorll: {},
            bridge: bridge,
            orderlist: []
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.order_action_mylist, opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                orderlist: isReset ? res.datas : _this.state.orderlist.concat(res.datas)
            });
            callback && callback();
        },function(err,status){
            appTool.superRemovePageLoading();//移除加载提示
            if(status == 2){
                //无数据
                $('.no-data-tip').html('暂无订单数据');
                setTimeout(function(){
                    _this.state.scorll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },200);
            }
        });
    },
    componentDidMount: function(){
        var _this = this;
        appTool.playLogin(_this.state.bridge, 'myorder'); //校验登录
        // appTool.rmPageLoading();//页面加载完成移出提示 
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.my-order-body',0);
    },
    onPullDown: function(paging){
        this.setState({
            scorll: paging
        });
        //下拉刷新
        this.loadPagingData({
            "prodOrder.userid": this.state.user.userid,
            "prodOrder.delflag": 0,
            "prodOrder.currentPage": 1,
            "prodOrder.pageSize": this.state.pageSize
        },true, function(){
            setTimeout(function(){paging.refresh()},500);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "prodOrder.userid": this.state.user.userid,
            "prodOrder.delflag": 0,
            "prodOrder.currentPage": this.state.currentPage+1,
            "prodOrder.pageSize": this.state.pageSize
        },false,function(){
            setTimeout(function(){paging.refresh()},500);
        });
    },
    acOrderInfoDetail: function(e){
        //订单详情
        var _this = this;
        var dom = $(e.target);
        var href = dom.data('href');
        // var title = dom.data('title');
        var linkdata = appTool.setAppData("订单详情", href, "order_detail");

        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, linkdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(href);
        }
    },
    render: function () {
        var _this = this;
        var list = this.state.orderlist.map(function(o){
            var firstgood = o.details[0];
            var orderstate = '';
            if(o.state=='0'){
                orderstate = '未付款';
            }else if(o.state == '1'){
                orderstate = '已付款';
            }else if(o.state == '2'){
                orderstate = '发货中';
            }else if(o.state == '3'){
                orderstate = '已过期';
            }else if(o.state == '4'){
                orderstate = '已取消';
            }else if(o.state == '5'){
                orderstate = '申请退款';
            }else if(o.state == '6'){
                orderstate = '退款中';
            }else if(o.state == '7'){
                orderstate = '已完成';
            }
            if(!firstgood.vmGoods || firstgood.vmGoods == null || firstgood.vmGoods == 'null'){
                firstgood.vmGoods = {};
            }
            var url = "/pages/order_detail/order_detail.html?ordernum="+o.parentid;
            // var linkdata = appTool.setAppData("订单详情", url, "order_detail");
            var gimg = _this.state.systemparam.prefix_pic_thumbnail+"/"+ firstgood.vmGoods.imgurl;
            return (
                <li key={o.parentid+Math.random()}>
                   <div className="status">
                        <span className='left'>订单状态 (共{o.details.length}单)</span>
                        <span className='right'>{orderstate}</span>
                   </div> 
                   <div className="info">
                            <div className='img-box'>
                                <a>
                                    {
                                        firstgood.vmGoods.imgurl?
                                        <img onClick={_this.acOrderInfoDetail} data-href={url} src={gimg}/>:null
                                    }
                                </a>
                            </div>
                            <div className='right'>
                                <a>
                                    <div onClick={_this.acOrderInfoDetail} data-href={url} className='tex'>{firstgood.name}</div>
                                </a>
                                <div className='hdl'>
                                    <b><font>{'￥'+firstgood.payprice}</font></b>
                                    <strong>{'x'+firstgood.buyqty}</strong>
                                </div>
                            </div>
                   </div>
                   <div className="pay-text"><span>实付：</span><font>￥{o.payprice}</font></div>
                </li>
            );
        });
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="my-order-body">
                <ul className="order-list-data">
                    {this.state.orderlist.length? list : <center className="no-data-tip">正在加载...</center>}
                </ul>
            </div>
            </PullPaging>
        );
    }
});

