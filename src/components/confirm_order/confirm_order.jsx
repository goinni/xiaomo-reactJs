var ConfirmOrderPageHeader = React.createClass({
    render: function () {
        return (
            <div className="confirm-order-page-header">
                <AlinkBack />
                <h1 className="title">确认订单</h1>
            </div>
        );
    }
});
var ConfirmOrderPageBody = React.createClass({
    getInitialState: function(){
        var ordernum = appTool.queryUrlParam('ordernum');
        var user = appTool.getUserInfoEntity();
        var ordertime = "";//订单生成时间
        var sellprice = 0;//订单总金额
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
        //获取订单信息
        appTool.sendAjax(Uri.order_action_info,{
            "prodOrder.parentid": ordernum
        },function(res){
            var temporder = res[0];
            //订单信息
            ordertime = temporder.addtime;
            for(var i = 0; i< res.length; i++){
                sellprice += res[i].payprice;
            }
        },function(err){
            iAlert(err);
        },null,null,false);

        return {
            user: user,
            addrid: appTool.queryUrlParam('addrid'),
            ordernum: ordernum,
            orderCreateTime: ordertime,
            bridge: bridge,
            address:{},//空对象
            addrShengList: [],//省
            addrShiList: [],//市
            addrQuList: [],//区
            addressList: [],
            defaultAddress: {},
            countDownTime: 30, //订单倒计时30钟
            scroll: {},
            sellprice: sellprice,
            noAddress: true
        }
    },
    componentDidMount: function(){
        var _this = this;

        //oc调用h5
        appTool.ocToH5callback = function(data){
            // alert(data);
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
        //获取用户收货地址列表
        _this.getAddressList();
        //页面加载完成移出提示
        appTool.rmPageLoading();

        //倒计时
        var orderCtime = moment(this.state.orderCreateTime).unix();//订单创建的毫秒数
        var currCtime = moment().unix();//当前时间的毫秒数
        var orderGotTime = currCtime - orderCtime; //订单已经过去的毫秒数
        /**
         * 订单计时器
         */
        appTool.timerCountDown('#pay_timer_countdown,#order_count_down_time2', _this.state.countDownTime*60-orderGotTime);
        //设置支付总额
        $('#total_money_value2').html(this.state.sellprice);

        //去支付
        $('#go_pay_action_btn').click(function(){
            var oLen = $('.order-address-part').size();
            if(!oLen){
                iAlert("地址信息不能为空");
                return ;
            }
            var payway = $('.pay-btn').find('.active').attr('name');
            if(payway === 'weixin'){
                payway = 'wechatpay';
            }else{
                payway = 'alipay';
            }
            var otherdata = "{price:"+_this.state.sellprice+"}";//传给ios的支付参数
            var oc_url = "/pages/pay_over/pay_over.html?ordernum="+_this.state.ordernum;
            var iosdata = appTool.setAppData("支付购物车里的商品", oc_url, payway, otherdata);
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }

        });

        //获取省信息
        loadShengInfo();
        function loadShengInfo(){
            appTool.sendAjax(Uri.address_lev_sheng, {}, function(res){
                _this.setState({
                    addrShengList: res
                });
                //加载第二级
                loadShiInfo(res[0].areaid);
            }, function(err){
                iAlert(err);
            });
        }
        //市
        function loadShiInfo(pid){
            appTool.sendAjax(Uri.address_lev_shi, {
                "area.parentid": pid
            }, function(res){
                _this.setState({
                    addrShiList: res
                });
                //加载第三级
                loadQuInfo(res[0].areaid);
            }, function(err){
                iAlert(err);
            });
        }
        //区
        function loadQuInfo(pid){
            appTool.sendAjax(Uri.address_lev_qu, {
                "area.parentid": pid
            }, function(res){
                _this.setState({
                    addrQuList: res
                });
            }, function(err){
                iAlert(err);
            });
        }

        $('#user_addr_sheng').change(function(){
            // 省
            var pid = $(this).val();
            //获取市信息
            loadShiInfo(pid);
        });

        $('#user_addr_shi').change(function(){
            // 市
            var pid = $(this).val();
            //获取市信息
            loadQuInfo(pid);
        });
        $('#user_addr_qu').change(function(){
            // 区
            // console.log(3);
        });
    },
    getAddressList: function(){
        var _this = this;
        /**
         * 获取用户收货地址列表
         */
        appTool.sendAjax(Uri.user_address_list, {
            "address.userid": _this.state.user.userid
        }, function(res){
            var defaddr = res.length? res[0] :{}; //res 第一个即是默认地址
            if(res.length && _this.state.addrid){
                //有地址,并指定使用那个地址
                for(var i=0;i<res.length; i++){
                    if(_this.state.addrid == res[i].id){
                        defaddr = res[i];
                        break;
                    }
                }
            }
            //设置相关参数
            _this.setState({
                noAddress: !res.length,
                addressList: res,
                defaultAddress: defaddr
            });
            //刷新页面
            setTimeout(function(){
                _this.state.scroll.refresh();
            },110);
            
        },function(err, status){
            if(status != 2){
                iAlert(err);                
            }
        });
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    onsave: function(e){
        var _this = this;
        var province = $('#user_addr_sheng').val();
        var city = $('#user_addr_shi').val();
        var district = $('#user_addr_qu').val();
        var detailaddr = $('#user_addr_detail').val();
        var name = $('#user_addr_name').val();
        var phone = $('#user_addr_phone').val();
        var idcard = $('#user_addr_cardID').val();
        if(!name){
            appTool.toast('姓名不能为空');
            return ;
        }else if(!phone){
            appTool.toast('电话不能为空');
            return ;
        }else if(!province){
            appTool.toast('请选择省');
            return ;
        }else if(!city){
            appTool.toast('请选择市');
            return ;
        }else if(!district){
            appTool.toast('请选择区');
            return ;
        }else if(!detailaddr){
            appTool.toast('详细地址不能为空');
            return ;
        }else if(!idcard){
            appTool.toast('身份证号码不能为空');
            return ;
        }
        iAlert({
            text: "正在保存...",
            btnshow: false
        });
        /**
         * 创建用户收货地址
         */
        appTool.sendAjax(Uri.user_address_create, {
            "address.userid": _this.state.user.userid,
            "address.province": province,   //  省id
            "address.city": city,           //  市id
            "address.district": district,   //  区id
            "address.detailaddr": detailaddr,// 详细地址
            "address.name": name,           //  收货人姓名
            "address.phone": phone,         //  收货人电话
            "address.idcard": idcard        //  身份证号码
        }, function(res){
            iAlert({
                text: "保存成功",
                btnshow: false,
                autoClosed: 1000
            });
            //获取用户收货地址列表
            _this.getAddressList();
        }, function(err){
            iAlert(err);
        });
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
        var url = "/pages/order_detail/order_detail.html?ordernum="+this.state.ordernum;
        var linkdata = appTool.setAppData("订单详情", url, "order_detail");
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="confirm-order-body create-address-part">
                {
                   this.state.noAddress? 
                   <CreateAddressPart ordernum={this.state.ordernum} sheng={this.state.addrShengList} shi={this.state.addrShiList} qu={this.state.addrQuList} address={this.state.address} onsave={this.onsave}/>: 
                   <OrderAddressPart ordernum={this.state.ordernum} bridge={this.state.bridge} addr={this.state.defaultAddress} />
                }

                <div className="o-row-line o-save-btn look-order-detailbtn">
                    <div className='o-name'>订单详情</div>
                    <div className='o-value'><em>&nbsp;</em><span className="icon icon-right-nav"></span></div>
                    <Alink href={url} data={linkdata} bridge={this.state.bridge}></Alink>
                </div>

                <PayBlockPart onchanel={this.onchanel}/>
            </div>
</SimplePageScroll>
        );
    }
});

var OrderAddressPart = React.createClass({
    render: function () {
        var _this = this;
        var url = "/pages/choosed_address/choosed_address.html?ordernum="+this.props.ordernum;
        var linkdata = appTool.setAppData("地址选择", url, "choosed_address");
        return (
            <div className="order-address-part">
                <div className="timer">
                    <div className="tip">订单待支付</div>
                    <div className="value">还剩余<font id="order_count_down_time2">00:00:00</font>，之后订单将被关闭。</div>
                </div>
                <div className="address-info">
                <Alink href={url} data={linkdata} bridge={_this.props.bridge}>
                    <div className="man-info">
                        <span className="icon_man"><img src="/assets/iocn_man.png"/></span>
                        <span className="name">{this.props.addr.name}</span>
                        <span className="icon_phone"><img src="/assets/icon_phone.png"/></span>
                        <span className="phone">{this.props.addr.phone}</span>
                    </div>
                    <div className="address-text">
                        {this.props.addr.provincename}
                        {this.props.addr.cityname}
                        {this.props.addr.districtname}
                        {this.props.addr.detailaddr}
                        <span className="icon icon-right-nav"></span>
                    </div>
                </Alink>
                </div>
            </div>
        );
    }
});


