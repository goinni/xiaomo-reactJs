var PersonInfoPageHeader = React.createClass({
    render: function () {
        return (
            <div className="personinfo-page-header">
                <AlinkBack />
                <h1 className="title">个人资料</h1>
            </div>
        );
    }
});
var PersonInfoPageBody = React.createClass({
    getInitialState: function(){
        
        var _this = this, bridge, user = appTool.getUserInfoEntity();
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            bridge = event.bridge
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
            appTool.playLogin(bridge, 'person_info'); //校验登录
        });

        // 重新获取 个人基本信息
        appTool.sendAjax(Uri.personal_base_info,{
            "user.userid": user.userid
        },function(res){
            user = res;
            //缓存用户登录信息
            appTool.localSet("userInfoEntity", res);
        },function(err){
            iAlert("个人基础信息初始化失败");
        },null,null,false);
        return {
            userFaceImg: user.faceimg,
            bridge: bridge,
            user: user,
            systemparam: appTool.getSystemParam() //获取系统参数
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
        var _this = this;
        if(_this.state.userFaceImg){
            //初始化头相
            _this.setState({
                userFaceImg: _this.state.systemparam.prefix_pic_thumbnail + '/'+ _this.state.user.faceimg
            });
        }
        //oc调用h5
        appTool.ocToH5callback = function(data){
            if(data.match(/.png/) || data.match(/.jpg/)){
                var fimg = _this.state.systemparam.prefix_pic_thumbnail + '/'+data;
                _this.setState({
                    userFaceImg: fimg
                });
                $('.face-img-file img').attr('src', fimg);
                window.location.reload();//重新加载页面
            }
        }
        // 个人基本信息
        appTool.sendAjax(Uri.personal_base_info,{
            "user.userid": this.state.user.userid
        },function(res){
            _this.setState({
                user: res
            });
            //缓存用户登录信息
            appTool.localSet("userInfoEntity", res);
        },function(err){
            iAlert("个人基础信息初始化失败");
        });
        //选择
        $('.table-view-cell select').change(function(){
            $(this).parent().find('.badge').html($(this).val());
        });
        //请求图片上传
        $('#filePicker').click(function(){
            var oc_url = "/pages/person_info/person_info.html";
            var iosdata = appTool.setAppData("图片上传", oc_url, "picture", '{"userid":"'+_this.state.user.userid+'"}');
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata, function(imgdata){
                alert(imgdata);//上传图片回调
            });
            if(!appTool.hasAppBridge(_this.state.bridge)){
                iAlert('上传图片bridge获取失败');
                // appTool.go(oc_url);
            }
        });
    },
    saveInfo: function(){
        var _this = this;
        var nikename = $('.nike-name').val();
        var sex = $('.p-sex').val();
        var brithday = $('.brithday-input').val();
        //更新个人信息
        appTool.sendAjax(Uri.personal_base_info_update,{
            "user.userid": _this.state.user.userid,
            "user.name" : '',
            "user.nikename": encodeURIComponent(nikename),
            "user.sex": sex==='男'?1:2,
            "user.birthday": brithday,
            "user.idcard": "",
            "user.province": "",
            "user.city": "",
            "user.district": ""
        },function(res){
            appTool.toast('保存成功');
            // 个人基本信息
            appTool.sendAjax(Uri.personal_base_info,{
                "user.userid": _this.state.user.userid
            },function(res){
                _this.setState({
                    user: res
                });
                //缓存用户登录信息
                appTool.localSet("userInfoEntity", res);
            },function(err){
                iAlert("个人基础信息初始化失败");
            });
            // window.location.reload();
        },function(err){
            iAlert(err);
        });

        // appTool.go(appTool.pullHistoryLink());
    },
    addressMgr: function(e){
        e.stopPropagation();
        var _this = this;
        var oc_url = "/pages/choosed_address/choosed_address.html?pagetype=edit";
        var iosdata = appTool.setAppData("地址管理", oc_url, "address_mgr");
        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(oc_url);
        }
    },
    render: function () {

        return (
            <div className="personinfo-body">

                <ul className="table-view">
                      <li className="table-view-cell">
                        <div className="navigate-right">
                          头像:<font className="upload-error-msg"></font>
                        </div>
                        <div className="upload-file" id="filePicker"></div>
                        <div className="headimg uploader-list face-img-file">
                            <img src={this.state.userFaceImg? this.state.userFaceImg:"/assets/default_face.jpg"}/>
                        </div>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">{this.state.user.name}</span>
                          用户名:
                        </a>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          昵称:
                        </a>
                        <input name="nikename" className="nike-name" type="text" defaultValue={this.state.user.nikename}/>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">{this.state.user.sex==2 ? '女' : '男'}</span>
                          性别:
                        </a>
                        <select name="sex" className="p-sex" defaultValue={this.state.user.sex==2?'女': '男'}>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">
                            <input name="brithday" className="brithday-input" type="date" defaultValue={this.state.user.birthday}/>
                          </span>
                          生日:
                        </a>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right" onClick={this.addressMgr}>
                          <span onClick={this.addressMgr} className="badge"></span>
                          <span onClick={this.addressMgr}>地址管理:</span>
                        </a>
                      </li>
                </ul>
                <button onTouchStart={this.saveInfo} className="btn btn-negative btn-block">保存</button>
            </div>

        );
    }
});


