var ChoosedAddressPageHeader = React.createClass({
    render: function () {
        return (
            <div className="choosed-address-page-header">
                <AlinkBack />
                <h1 className="title">选择收货地址</h1>
            </div>
        );
    }
});
var ChoosedAddressPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, bridge={};
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
            user: appTool.getUserInfoEntity(),
            addressList: [],
            pagetype: appTool.queryUrlParam('pagetype') || '',
            ordernum: appTool.queryUrlParam('ordernum') || '',
            bridge: bridge,
            scroll: {}
        }
    },
    componentDidMount: function(){
        var _this = this;
        //初始化地址列表
        _this.getAddressList();
    },
    getAddressList: function(){
        var _this = this;
        /**
         * 获取用户收货地址列表
         */
        appTool.sendAjax(Uri.user_address_list, {
            "address.userid": _this.state.user.userid
        }, function(res){
            _this.setState({
                addressList: res
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },110);
            appTool.rmPageLoading();//页面加载完成移出提示
        },function(err){
            iAlert(err);
            appTool.rmPageLoading();//页面加载完成移出提示
        });
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    ondelete: function(e){
        var _this = this;
        var oaddrid = $(e.target).parent().parent().data('addrid');
        /**
         * 删除用户收货地址
         */
         iAlert({
            text: "正在删除...",
            btnshow: false
        });
        appTool.sendAjax(Uri.user_address_delete, {
            "address.id": oaddrid
        }, function(res){
            iAlert({
                text: "删除成功",
                btnshow: false,
                autoClosed: 1000
            });
            _this.getAddressList();
            // $(e.target).parent().parent().hide();
        },function(err){
            iAlert(err);
        });

    },
    render: function () {
        var createurl = "/pages/create_edit_address/create_edit_address.html?ordernum="+this.state.ordernum;
        var createlinkdata = appTool.setAppData("创建新地址", createurl, "create_address");
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="choosed-address-body">
               <ChooseOrderAddressPart ordernum={this.state.ordernum} bridge={this.state.bridge} list={this.state.addressList} pagetype={this.state.pagetype} ondelete={this.ondelete}/>
               <div className="o-create-address-btn">
                    <Alink className="btn btn-positive btn-block" href={createurl} data={createlinkdata} bridge={this.state.bridge}>
                        创建新地址
                    </Alink>
                </div>
            </div>
</SimplePageScroll>
        );
    }
});

var ChooseOrderAddressPart = React.createClass({
    render: function () {
        var _this = this;
        var addlist = this.props.list.map(function(o){
            var selecturl = "/pages/confirm_order/confirm_order.html?addrid="+o.id+"&ordernum="+_this.props.ordernum;
            var selectlinkdata = appTool.setAppData("订单确认", selecturl, "confirm_order");
            var editurl = "/pages/create_edit_address/create_edit_address.html?addrid="+o.id+"&ordernum="+_this.props.ordernum;
            var editlinkdata = appTool.setAppData("地址编辑", editurl, "edit_address");
            return (
                <div key={o.id} className="address-info" data-addrid={o.id}>
                    <SlideDeleteBox ondelete={_this.props.ondelete}>
                        <div className="man-info">
                            <span className="icon_man"><img src="/assets/iocn_man.png"/></span>
                            <span className="name">{o.name}</span>
                            <span className="icon_phone"><img src="/assets/icon_phone.png"/></span>
                            <span className="phone">{o.phone}</span>
                        </div>
                        <div className="address-text">
                                
                            {
                                _this.props.pagetype=='edit'?<font>{o.provincename}{o.cityname}{o.districtname}{o.detailaddr}</font>:
                                <Alink href={selecturl} data={selectlinkdata} bridge={_this.props.bridge}>
                                {o.provincename}{o.cityname}{o.districtname}{o.detailaddr}
                                </Alink>
                            }
                            
                            <Alink href={editurl} data={editlinkdata} bridge={_this.props.bridge}>
                            <span className="icon icon-compose"></span>
                            </Alink>
                        </div>
                    </SlideDeleteBox>
                </div>
            );
        });
        return (
            <div className="choosed-address-part">
                {addlist}
            </div>
        );
    }
});


