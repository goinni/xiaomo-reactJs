var CreateEditAddressPageHeader = React.createClass({
    render: function () {
        return (
            <div className="createedit-page-header">
                <AlinkBack />
                <h1 className="title">地址编辑</h1>
            </div>
        );
    }
});
var CreateEditAddressPageBody = React.createClass({
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
        var user = appTool.getUserInfoEntity();
        var addrid = appTool.queryUrlParam('addrid');
        var ordernum = appTool.queryUrlParam('ordernum');
        var address = {};
        //获取被编辑的地址
        if(addrid){
            /**
             * 获取用户收货地址列表
             */
            appTool.sendAjax(Uri.user_address_list, {
                "address.userid": user.userid
            }, function(res){
                if(res.length && addrid){
                    //有地址,并指定使用那个地址
                    for(var i=0;i<res.length; i++){
                        if(addrid == res[i].id){
                            address = res[i];
                            break;
                        }
                    }
                }
            },function(err){
                iAlert(err);
            },null,null,false);
        }
        return {
            addrShengList: [],//省
            addrShiList: [],//市
            addrQuList: [],//区
            user: user,
            addrid: addrid,
            bridge: bridge,
            ordernum: ordernum,
            address: address
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        var hasAddr = this.state.address;
        if(hasAddr.province){
            //有地址回显信息
            loadShengInfo(hasAddr.province, hasAddr.city, hasAddr.district);
        }else{
            loadShengInfo();
        }
        //获取省信息
        function loadShengInfo(p, c, d){
            appTool.sendAjax(Uri.address_lev_sheng, {}, function(res){
                _this.setState({
                    addrShengList: res
                });
                //加载第二级
                if(p && c){
                    loadShiInfo(p, c);
                }else{
                    loadShiInfo(res[0].areaid);
                }
                
            }, function(err){
                iAlert(err);
            });
        }
        //市
        function loadShiInfo(pid, c){
            appTool.sendAjax(Uri.address_lev_shi, {
                "area.parentid": pid
            }, function(res){
                _this.setState({
                    addrShiList: res
                });
                //加载第三级
                if(c){
                    loadQuInfo(c);
                }else{
                    loadQuInfo(res[0].areaid);
                }
                
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
    onsave: function(){
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
        
        var tempUrl = "";
        var tempData = {
            "address.userid": _this.state.user.userid,
            "address.province": province,   //  省id
            "address.city": city,           //  市id
            "address.district": district,   //  区id
            "address.detailaddr": detailaddr,// 详细地址
            "address.name": name,           //  收货人姓名
            "address.phone": phone,         //  收货人电话
            "address.idcard": idcard        //  身份证号码
        };
        if(this.state.addrid){
            //编辑地址
            tempUrl = Uri.user_address_edit;
            tempData["address.id"] = this.state.addrid;
        }else{
            //新增地址
            tempUrl = Uri.user_address_create;
        }
        /**
         * 保存用户收货地址
         */
        appTool.sendAjax(tempUrl, tempData, function(res){
            iAlert({
                text: "保存成功",
                btnshow: false,
                autoClosed: 1000
            });
            //操作成功后跳转到地址选择列表页面
            var oc_url = "/pages/choosed_address/choosed_address.html?ordernum="+_this.state.ordernum;
            var iosdata = appTool.setAppData("地址选择", oc_url, "choosed_address");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                setTimeout(function(){
                    appTool.go(oc_url);
                },900);
            }
        }, function(err){
            iAlert(err);
        });
    },
    render: function () {
        return (
            <div className="createedit-address-body">
                <CreateAddressPart ordernum={this.state.ordernum} sheng={this.state.addrShengList} shi={this.state.addrShiList} qu={this.state.addrQuList} address={this.state.address} bridge={this.state.bridge} onsave={this.onsave}/>
            </div>
        );
    }
});


