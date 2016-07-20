var FaWenPageHeader = React.createClass({
    render: function () {
        return (
            <div className="fa-wen-page-header">
                <AlinkBack />
                <h1 className="title">发问</h1>
                <a id="fa_tei_btn" className="btn btn-link pull-right">发表</a>
            </div>
        );
    }
});
var FaWenPageBody = React.createClass({
    getInitialState: function(){
        var labels = appTool.localGet('_user_fa_labels') || "";
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
            user: appTool.getUserInfoEntity(),
            bridge: bridge,
            searchmarklist: [],
            labels: labels && labels.split(',') || []
        }
    },
    componentDidMount: function(){
        var _this = this;
        //oc调用h5
        appTool.ocToH5callback = function(data){
            if(!data.match(/appCacheUserId/)){
                if(_this.state.user && _this.state.user.userid){
                    _this.faTeiEvent();
                }else{
                    appTool.playLogin(_this.state.bridge, 'fa_wen'); //校验登录
                }
            }
        }
        appTool.rmPageLoading();//页面加载完成移出提示
        //发贴事件
        $('#fa_tei_btn').click(function(){
            _this.faTeiEvent();
        });
        //数据回显
        $('#f_t_title').val(appTool.localGet('_user_fa_title'));
        $('#f_t_text').val(appTool.localGet('_user_fa_text'));

        //发表内容改变事件
        $('#f_t_text').bind("input propertychange",function(e){
            var text = $(this).val();
            appTool.localSet('_user_fa_text', text);//临时缓存 用户发表的内容
        });
        //发表标题改变事件
        $('#f_t_title').bind("input propertychange",function(e){
            var text = $(this).val();
            appTool.localSet('_user_fa_title', text);
        });
        
        $(".nav-mark-input2").on('input propertychange',function(){

            appTool.sendAjax(Uri.search_mark_list,{
                "label.name": $(this).val()
            },function(res){
                _this.setState({
                    searchmarklist: res.datas
                });
            },function(err){
                // iAlert(err);
            });
        });
    },
    faTeiEvent: function(){
        var _this = this;
        var user = appTool.getUserInfoEntity();//获取用户信息
        var content = $('#f_t_text').val();//发帖内容
        var title = $('#f_t_title').val();//发贴标题
        if(!title){
            iAlert('发贴标题不能为空');
            return false;
        }
        if(!content){
            iAlert('发帖内容不能为空');
            return false;
        }
        // if(!_this.state.uploadImg){
        //     iAlert('请上传图片');
        //     return false;
        // }

        //添加请求
        appTool.sendAjax(Uri.community_bbs_add_info,{
            "bbsPost.userid": user.userid,
            "bbsPost.content": content,
            "bbsPost.sortid": appTool.queryUrlParam('sortid'),
            "bbsPost.imgurl": '',
            "bbsPost.title": title,
            "bbsPost.labels": this.state.labels.join(',')
        },function(res){
            //发表成功，跳转到上一个页面
            appTool.localRemove('_user_fa_title'); //清除缓存 
            appTool.localRemove('_user_fa_text');
            appTool.localRemove('_user_fa_labels');

            appTool.localSet('_community_win_index', "qa"); //设置当前为问答
            //返回上一级页面
            // appTool.go(appTool.pullHistoryLink());
            var oc_url = "/pages/community_myframe/community_myframe.html?bbsindex=1";
            var iosdata = appTool.setAppData("社区", oc_url, "edit");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        },function(err){
            iAlert(err);
        });
    },
    addMarkPlease: function(e){
        $('.add-btn-place').removeAttr('href');
        var _this = this;
        var isselected = $(e.target).attr('name');//区分选择和输入
        var intext = isselected!='1'? $('.nav-mark-input2').val() : $(e.target).html();
        if(!intext){
            iAlert('标签名不能为空');
            return ;
        }
        //隐藏面板
        $('#myModalexample').removeClass('active');

        var tmpmk = appTool.localGet('_user_fa_labels') || [];
        if(tmpmk.length){
            tmpmk = tmpmk.split(',');
        }
        if(tmpmk.indexOf(intext)==-1){
            //不包含则添加
            tmpmk.push(intext);
        }
        this.setState({
            labels: tmpmk
        });
        appTool.localSet('_user_fa_labels',tmpmk.join(','));
        //清空输入框
        $('.nav-mark-input2').val('');
        setTimeout(function(){
            $('.nav-mark-input2').focus();
        },800);
        
        // setTimeout(function(){
        //     _this.state.scroll.refresh();
        // },200);
    },
    rmMark: function(e){
        //删除标签
        var _this = this;
        var name = $(e.target).html();
        var mindex = _this.state.labels.indexOf(name);
        _this.state.labels.splice(mindex,1);
        _this.setState({
            labels: _this.state.labels
        });
        appTool.localSet('_user_fa_labels',_this.state.labels.join(','));
    },
    render: function () {
        var _this = this;
        var labels = this.state.labels.map(function(o){
            return (
                <li onTouchStart={_this.rmMark} key={Math.random()}>{o}</li>
            );
        });
        var marklist = this.state.searchmarklist.map(function(o){
            return (
                <li key={Math.random()+o.labeid}>
                    <a name="1" onTouchStart={_this.addMarkPlease}>{o.name}</a>
                </li>
            );
        });
        // var url = "/pages/fa_marks/fa_marks.html";
        // var linkdata = appTool.setAppData("添加标签", url, "fa_marks");
        return (
            <div className="fa-wen-body">
                <div className="f-title">标题（100个字以内）</div>
                <div className="f-content">
                    <input maxLength="100" id="f_t_title" type="text" placeholder="请输入"/>
                </div>
                <div className="f-title">正文（10000个字以内）</div>
                <div className="f-content">
                    <textarea maxLength="10000" id="f_t_text" placeholder="请输入"></textarea>
                </div>
                <ul className="marks-part-area">
                    {labels}
                </ul>
                <ul className="table-view">
                  <li className="table-view-cell">
                    <a href="#myModalexample" id="go_add_mark_btn" className="navigate-right">
                      添加标签
                    </a>
                  </li>
                </ul>

                <div id="myModalexample" className="modal">
                  <header className="bar bar-nav">
                    <a className="icon icon-close pull-right" href="#myModalexample"></a>
                    <h1 className="title">
                        <input type="search" maxLength='6' className="nav-mark-input2" placeholder="标签名最多6个字"/>
                    </h1>
                  </header>

                  <div className="content fa-marks-page-body">

                        <a onTouchStart={this.addMarkPlease} className="add-btn-place">
                            <div className="img-icon">+</div>
                            <div className="tip">点击添加</div>
                        </a>
                        <ul className="mark-list">
                            {marklist}
                        </ul>
                  </div>
                </div>

            </div>

        );
    }
});


