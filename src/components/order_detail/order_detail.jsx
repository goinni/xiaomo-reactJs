var OrderDetailPageHeader = React.createClass({
    render: function () {
        return (
            <div className="order-detail-page-header">
                <AlinkBack />
                <h1 className="title">订单详情</h1>
            </div>
        );
    }
});
var OrderDetailPageBody = React.createClass({
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
            ordernum: appTool.queryUrlParam('ordernum'),
            orderCtime: '',
            scroll: {},
            orderstate: 0,
            bridge: bridge,
            countDownTime: 30,
            orderlist: []
        }
    },
    componentDidMount: function(){
        var _this = this;
        //oc调用h5
        appTool.ocToH5callback = function(data){
            if(!data.match(/appCacheUserId/)){
                var oc_url = "/pages/pay_over/pay_over.html?ordernum="+_this.state.ordernum;
                var iosdata = appTool.setAppData("支付成功", oc_url, "pay_over");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                }
            }
        }
        appTool.rmPageLoading();//页面加载完成移出提示
        
        //获取订单信息
        appTool.sendAjax(Uri.order_action_info,{
            "prodOrder.parentid": _this.state.ordernum
        },function(res){
            var temporder = res[0];
            _this.setState({
                orderlist: res,
                orderstate: temporder.state,
                orderCtime: temporder.addtime
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },110);
            //倒计时
            var orderCtime = moment(_this.state.orderCtime).unix();//订单创建的毫秒数
            var currCtime = moment().unix();//当前时间的毫秒数
            var orderGotTime = currCtime - orderCtime; //订单已经过去的毫秒数
            /**
             * 订单计时器
             */
            appTool.timerCountDown('#pay_timer_countdown', _this.state.countDownTime*60-orderGotTime);
        },function(err){
            iAlert(err);
        });
         //去支付
        $('#go_pay_action_btn').click(function(){
            var payway = $('.pay-btn').find('.active').attr('name');
            if(payway === 'weixin'){
                payway = 'wechatpay';
            }else{
                payway = 'alipay';
            }
            var totalprice = $('#total_money_value2').html();
            var otherdata = "{price:"+ totalprice +"}";//传给ios的支付参数
            var oc_url = "/pages/pay_over/pay_over.html?ordernum="+_this.state.ordernum;
            var iosdata = appTool.setAppData("支付购物车里的商品", oc_url, payway, otherdata);
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
        scroll.refresh();
    },
    onchanel: function(){
        var _this = this;
        //取消订单
        iAlert({
            text: '亲，再考虑一下嘛~',
            confirm: true,
            callback: function(){
                //取消订单
                appTool.sendAjax(Uri.order_action_cancel, {
                    "prodOrder.parentid": _this.state.ordernum
                }, function(res){
                    iAlert('订单取消成功');
                    //隐藏支付工具条
                    $('#confirm_order_bar,.pay-block-part').hide();
                }, function(err){
                    iAlert(err);
                });
            }
        });
    },
    render: function () {
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="order-detail-body create-address-part buycar-page-body">
                <div className="o-time-info">
                    <div className='o-num'>订单号：{this.state.ordernum}</div>
                    <div className='o-time'>下单时间：{this.state.orderCtime}</div>
                </div>

                <OrderDetialListData path={this.state.systemparam} list={this.state.orderlist}/>
                
                <div className='os-stauts-place'>
                    <div className='os-name'>运费</div>
                    <div className='os-stauts2'>免运费</div>
                </div>
                {
                    this.state.orderstate == '0'? <PayBlockPart onchanel={this.onchanel}/> : null
                }
                
            </div>
</SimplePageScroll>
        );
    }
});

var OrderDetialListData = React.createClass({

    render: function () {
        var _this = this;
// 0:未付款   1:已付款  2:发货中  3:已过期  4:取消  5:申请退款  6:退款中  7：已完成
        var allprice = 0;
        var glist = this.props.list.map(function(o){
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
            //只有在需要支付的时候显示支付工具条
            if(o.state != '0'){
                //隐藏支付工具条
                $('#confirm_order_bar').hide();
            }
            //累加支付总额
            allprice += o.payprice;

            //订单里的商品
            var goodlist = o.details.map(function(goods){
                //商品图片
                var imgUrl = _this.props.path.prefix_pic_thumbnail+'/'+goods.vmGoods.imgurl;
                return (
                    <li key={goods.id}>
                        <div className='img-box'>
                                <img src={imgUrl}/>
                        </div>
                        <div className='right'>
                                <div className='tex'>{goods.name}</div>
                            <div className='hdl'>
                                <b>￥<font>{goods.payprice}</font></b>
                                <strong>{'X'+goods.buyqty}</strong>
                            </div>
                        </div>
                    </li>
                );
            });
            return (
                <div key={o.ordrid+Math.random()}>
                    <div className='os-stauts-place'>
                        <div className='os-name'>{o.ordrid.split('-')[1]+'. '} 订单状态 </div>
                        <div className='os-stauts'>
                            {orderstate}
                        </div>
                    </div>
                    <ul className='order-list'>
                        {goodlist}
                    </ul>
                </div>
            );
        });
//设置支付总额
        $('#total_money_value2').html(allprice);
        return (
            <div>
                {glist}
            </div>
        );
    }
});
