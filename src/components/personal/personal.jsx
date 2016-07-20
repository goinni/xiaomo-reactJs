var PersonalPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="personal-page-header">
                  <a data-transition="slide-out" href="/pages/person_seting/person_seting.html" className="icon icon-left-nav pull-left"></a>
                  <a data-transition="slide-in" href="/pages/notiylist/notiylist.html" className="icon icon-compose pull-right"></a>
                  <h1 className="title">个人中心</h1>
            </div>
        );
    }
});
var PersonalPageBody = React.createClass({
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
            initTime: new Date().getTime(),
            user: appTool.getUserInfoEntity() || '',
            systemparam: appTool.getSystemParam(),//获取系统参数
            person: {},
            labels: [],
            shlist:[],
            currentPage: 1,
            newslist: [],
            goodlist: [],
            pageSize: 10,
            openwin: true,
            liketag: 'action',
            reqUrl:"",
            reqParam: {},
            actionlist: [],
            bridge: bridge,
            scroll:{}
        }
    },
    deleteAcInfo: function(e){
        //删除发表的状态
        var _this = this;
        var entity = e.srcElement || e.target;
        
        //请求后台删除
        var postid = $(entity).parent().parent().attr('name');

        appTool.sendAjax(Uri.community_bbs_update_info,{
            "bbsPost.postid": postid,
            "bbsPost.delflag" : 1
        },function(res){
            var templist = _this.state.actionlist;
            for(var i = 0; i<templist.length; i++){
                if(templist[i].postid == postid){
                    templist.splice(i, 1);
                    break;
                }
            }
            //更新状态列表
            _this.setState({
                actionlist: templist
            });
            //刷新页面
            setTimeout(function(){_this.state.scroll.refresh();},200);
            //重新加载数据
            // _this.onPullDown(_this.state.scroll);

        },function(err){
            iAlert("删除失败");
        });
    },
    checkActionsData: function(){
        var boxH = parseFloat($('.mine-dongtai').css('height'));
        if(boxH<30){
            this.setState({
                actionlist: []
            });
            $('.mine-dongtai').html('<center>亲，去发表个动态吧~</center>');
        }
    },
    addMarkDelEv: function(){
        var _this =this;
        $("#infomationMarks span").click(function(){
            var mName = $(this).html(),_t = this, count = 0;

            iAlert({
                confirm: true,
                text:'要删除标签 [ '+mName +' ]嘛?',
                btext: '确定',
                callback: function(){
                    var c_labels = [];
                    // 将原有的标签取出
                    $('#infomationMarks span').each(function(){
                        var sl = $(this).html();
                        if(sl != mName){
                            c_labels.push(sl);
                        }
                    });
                    //请求后台修改标签内容
                    appTool.sendAjax(Uri.person_upload_userlabels,{
                        "user.userid": _this.state.user.userid,
                        "user.labels": c_labels.join(',')
                    },function(res){
                        //设置分享数据
                        _this.setState({
                            labels: c_labels
                        });
                        if(!c_labels.length){
                            $("#infomationMarks").html('<font>亲，给自己加个标签哇~</font>');
                        }
                        //刷新
                        _this.reloadPageScroll();
                    },function(err){
                        iAlert(err);
                    });
                }
            });

        });
    },
    deleteSelfMark: function(e){
        var _this = this;
        var mName = $(e.target).html(),_t = e.target, count = 0;

            iAlert({
                confirm: true,
                text:'要删除标签 [ '+mName +' ]嘛?',
                btext: '确定',
                callback: function(){
                    var c_labels = [];
                    // 将原有的标签取出
                    $('#infomationMarks span').each(function(){
                        var sl = $(this).html();
                        if(sl != mName){
                            c_labels.push(sl);
                        }
                    });
                    //请求后台修改标签内容
                    appTool.sendAjax(Uri.person_upload_userlabels,{
                        "user.userid": _this.state.user.userid,
                        "user.labels": c_labels.join(',')
                    },function(res){
                        //设置分享数据
                        _this.setState({
                            labels: c_labels
                        });
                        if(!c_labels.length){
                            $("#infomationMarks").html('<font>亲，给自己加个标签哇~</font>');
                        }
                        //刷新
                        _this.reloadPageScroll();
                    },function(err){
                        iAlert(err);
                    });
                }
            });
    },
    addLikeTagEv: function(){
        var _this = this;
        //我的喜欢 商品 资讯 帖子 事件绑定
        $(".list-control-part a").unbind('click').click(function(){
            $(this).parent().find('a.ac').removeClass('ac');
            $(this).addClass("ac");
            var name = $(this).attr('name');
            //设置当前查看的喜欢
            _this.setState({
                liketag: name
            });
            if(name === 'goods'){
                console.log('goods');
                // 初始化要默认加载的请求参数
                _this.setState({
                    reqUrl: Uri.person_shouchang_goods,
                    reqParam: {
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 2
                    }
                });
            }else if(name === 'news'){
                console.log('news');
                // 初始化要默认加载的请求参数
                _this.setState({
                    reqUrl: Uri.person_shouchang_news,
                    reqParam: {
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 1
                    }
                });
            }else {
                console.log('bbs');
                // 初始化要默认加载的请求参数
                _this.setState({
                    reqUrl: Uri.person_shouchang_bbs,
                    reqParam: {
                        "userCollect.userid": _this.state.user.userid,
                        "userCollect.currentPage": 1,
                        "userCollect.pageSize": _this.state.pageSize,
                        'userCollect.etype': 5
                    }
                });
            }
            //刷新页面
            _this.reloadPageScroll();
        });
    },
    initUserInfoData: function(){
        //初始化用户登录信息
        var _this = this;
        $('#itemQaContent_nav').click(function(){
            //我的动态
            _this.setState({
                liketag: 'action',
                reqUrl: Uri.person_mine_actions,
                reqParam: {
                    "bbsPost.userid": _this.state.user.userid,
                    "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize
                }
            });
            $('#itemShContent_nav').removeClass('active');
            $('#itemShContent').removeClass('active');
            $('#itemQaContent').addClass('active');
            $(this).addClass('active');
            setTimeout(function(){
                _this.state.scroll.refresh();
            },110);
        });

        $('#itemShContent_nav').click(function(){
            //我的分享
            _this.setState({
                liketag: 'bbs',
                reqUrl: Uri.person_shouchang_bbs,
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": 1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 5
                }
            });

            $('#itemQaContent_nav').removeClass('active');
            $('#itemQaContent').removeClass('active');
            $('#itemShContent').addClass('active');
            $(this).addClass('active');

            $(".list-control-part a").removeClass('ac');
            $(".list-control-part a[name='bbs']").addClass('ac');

            _this.addLikeTagEv();//添加事件
            setTimeout(function(){
                _this.state.scroll.refresh();
            },110);
        });
        // 初始化要默认加载的请求参数
        this.setState({
            reqUrl: Uri.person_mine_actions,
            reqParam: {
                "bbsPost.userid": this.state.user.userid,
                "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
                "bbsPost.currentPage": 1,
                "bbsPost.pageSize": this.state.pageSize
            }
        });
        // 个人基本信息
        appTool.sendAjax(Uri.personal_base_info,{
            "user.userid": this.state.user.userid
        },function(res){
            _this.setState({
                labels: res.labels && res.labels.split(',') || [],
                person: res
            });
            //缓存用户登录信息
            appTool.localSet("userInfoEntity", res);
        },function(err){
            iAlert("个人基础信息初始化失败");
        });

        // 个人分享
        appTool.sendAjax(Uri.person_shouchang_bbs,{
            "userCollect.userid": this.state.user.userid,
            "userCollect.currentPage": 1,
            "userCollect.pageSize": this.state.pageSize,
            'userCollect.etype': 5
        },function(res){
            var shlist = res.datas;
            //设置分享数据
            _this.setState({
                shlist: shlist
            });
        },function(err, status){
            if(status!=2){
                iAlert(err);                    
            }
        });
        // 喜欢-资讯
        appTool.sendAjax(Uri.person_shouchang_news,{
            "userCollect.userid": this.state.user.userid,
            "userCollect.currentPage": 1,
            "userCollect.pageSize": this.state.pageSize,
            'userCollect.etype': 1
        },function(res){
            var newslist = res.datas;
            //设置分享数据
            _this.setState({
                newslist: newslist
            });
        },function(err, status){
            if(status!=2){
                iAlert(err);                    
            }
        });
        // 喜欢-商品
        appTool.sendAjax(Uri.person_shouchang_goods,{
            "userCollect.userid": this.state.user.userid,
            "userCollect.currentPage": 1,
            "userCollect.pageSize": this.state.pageSize,
            'userCollect.etype': 2
        },function(res){
            var goodlist = res.datas;
            //设置分享数据
            _this.setState({
                goodlist: goodlist
            });
        },function(err, status){
            if(status!=2){
                iAlert(err);                    
            }
        });

        // 我的动态
        appTool.sendAjax(Uri.person_mine_actions,{
            "bbsPost.userid": this.state.user.userid,
            "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
            "bbsPost.currentPage": 1,
            "bbsPost.pageSize": this.state.pageSize
        },function(res){
            var actionlist = res.datas;
            //设置分享数据
            _this.setState({
                actionlist: actionlist
            });
            //刷新页面
            // _this.reloadPageScroll();
            //校验数据
            setTimeout(function(){
                _this.checkActionsData();
            },100);
        },function(err, status){
            if(status!=2){
                iAlert(err);                    
            }
        });
    },
    componentDidMount: function(){
        var _this = this;
        
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.personal-body', 0);
        if(this.state.user && this.state.user != null){
            _this.initUserInfoData();
        }else{
            setTimeout(function(){
                appTool.rmPageLoading();//页面加载完成移出提示 
            },800);
            _this.checkActionsData();
        }
        
        //标签点击删除事件
        // _this.addMarkDelEv();
        //添加标签
        $("#man_add_mark").click(function(){
            var input = $("<input placeholder='请输入5字以内标签名' maxlength=5 class='input-mark-name'>");
            var p = $('<p>').append(input);
            iAlert({
                title: "新增标签",
                text: p,
                btext: '确定',
                confirm: true,
                callback: function(a){
                    var name = $('.input-mark-name').val();
                    if(name){
                        var c_labels = [];
                        // 将原有的标签取出
                        $('#infomationMarks span').each(function(){
                            var sl = $(this).html();
                            c_labels.push(sl);
                        });
                        //把当前新标签一起放入参数对象中
                        c_labels.push(name);
                        //请求后台添加标签
                        appTool.sendAjax(Uri.person_upload_userlabels,{
                            "user.userid": _this.state.user.userid,
                            "user.labels": c_labels.join(',')
                        },function(res){
                            //设置分享数据
                            _this.setState({
                                labels: c_labels
                            });
                        },function(err){
                            iAlert(err);
                        });

                        //更新UI前先将提示无的信息去掉
                        // $("#infomationMarks font").hide();
                        //更新事件
                        _this.addMarkDelEv();
                        _this.reloadPageScroll();//刷新
                    }
                }
            });
        });
        //页面初始化延迟1秒执行内容
        function checkinittime(){
            var st = _this.state.initTime;
            var et = new Date().getTime();
            var r = et - st;
            return r>1100;
        }
        //查看购物车
        $('#look_my_buycar_btn').click(function(){
            if(!checkinittime()){
                return false;
            }
            appTool.playLogin(_this.state.bridge, 'personal'); //校验登录
            if(_this.state.user && _this.state.user.userid){
                var oc_url = "/pages/buycar/buycar.html?userid="+_this.state.user.userid;
                var iosdata = appTool.setAppData("购物车", oc_url, "buy_car");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                }
            }
        });
        //查看订单
        $('#look_my_order_btn').click(function(){
            if(!checkinittime()){
                return false;
            }
            appTool.playLogin(_this.state.bridge, 'personal'); //校验登录
            if(_this.state.user && _this.state.user.userid){
                var oc_url = "/pages/myorder/myorder.html?userid="+_this.state.user.userid;
                var iosdata = appTool.setAppData("我的订单", oc_url, "my_order");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                } 
            }
        });
        //礼券
        $('#lijuan_look_btn').click(function(){
            if(!checkinittime()){
                return false;
            }
            var oc_url = "/pages/lijuan/lijuan.html";
            var iosdata = appTool.setAppData("礼券", oc_url, "lijuan");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        //客服
        $('#kefu_look_btn').click(function(){
            if(!checkinittime()){
                return false;
            }
            var oc_url = "/pages/kefu/kefu.html";
            var iosdata = appTool.setAppData("客服", oc_url, "kefu");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
    },
    reloadPageScroll:function(){
        var _this = this;
        setTimeout(function(){
            _this.state.scroll.refresh();
        },110);
    },
    doLogin: function(){
        var _this = this;
        var oc_url = "/pages/login_mobile/login_mobile.html";
        var iosdata = appTool.setAppData("登录", oc_url, "icenterlogin");
        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(oc_url);
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        if(!this.state.reqUrl){
            this.state.scroll.refresh();
            return ;
        }
        appTool.sendPageAjax(this.state.reqUrl, opt, function(res){
            if(_this.state.liketag === 'action'){
                _this.setState({
                    currentPage: res.currentPage,
                    actionlist: isReset ? res.datas : _this.state.actionlist.concat(res.datas)
                });
            }else if(_this.state.liketag === 'goods'){
                _this.setState({
                    currentPage: res.currentPage,
                    goodlist: isReset ? res.datas : _this.state.goodlist.concat(res.datas)
                });
            }else if(_this.state.liketag === 'news'){
                _this.setState({
                    currentPage: res.currentPage,
                    newslist: isReset ? res.datas : _this.state.newslist.concat(res.datas)
                });
            }else if(_this.state.liketag === 'bbs'){
                _this.setState({
                    currentPage: res.currentPage,
                    shlist: isReset ? res.datas : _this.state.shlist.concat(res.datas)
                });
            }
            //下拉刷新上拉加载回调用
            callback && callback();
        },function(err, status){
            if(status == '2'){
                // appTool.toast('亲，暂无可用数据~');
                 //无数据
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
                if(_this.state.currentPage==1 && !_this.state.actionlist.length){
                    if(_this.state.liketag === 'action'){
                        _this.setState({
                            actionlist:[]
                        });
                    }
                    //我的动态数据校验
                    _this.checkActionsData();
                }
            }else{
                iAlert(err);                    
            }
            setTimeout(function(){
                _this.state.scroll.refresh();
                appTool.rmPageLoading();//页面加载完成移出提示 
            },800);
        });
    },
    onPullDown: function(paging){
        var _this = this;
        this.setState({
            scroll: paging
        });
        var name = this.state.liketag;
        if(name === 'action'){
            _this.setState({
                reqParam: {
                    "bbsPost.userid": _this.state.user.userid,
                    "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize
                }
            });
        }else if(name === 'goods'){
            console.log('goods');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": 1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 2
                }
            });
        }else if(name === 'news'){
            console.log('news');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": 1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 1
                }
            });
        }else {
            console.log('bbs');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": 1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 5
                }
            });
        }
        //下拉刷新
        this.loadPagingData(this.state.reqParam, true, function(){
            setTimeout(function(){paging.refresh();},300);
            //iframe页面特殊处理
            // appTool.addFrameAevent();
        });
    },
    onPullUp: function(paging){
        var _this =this;
        var name = this.state.liketag;
        if(name === 'action'){
            _this.setState({
                reqParam: {
                    "bbsPost.userid": _this.state.user.userid,
                    "bbsPost.sortid": "", //【1：问答区  2：分享区】如果不传递，取所有
                    "bbsPost.currentPage": _this.state.currentPage+1,
                    "bbsPost.pageSize": _this.state.pageSize
                }
            });
        }else if(name === 'goods'){
            console.log('goods');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 2
                }
            });
        }else if(name === 'news'){
            console.log('news');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 1
                }
            });
        }else {
            console.log('bbs');
            // 初始化要默认加载的请求参数
            _this.setState({
                reqParam: {
                    "userCollect.userid": _this.state.user.userid,
                    "userCollect.currentPage": _this.state.currentPage+1,
                    "userCollect.pageSize": _this.state.pageSize,
                    'userCollect.etype': 5
                }
            });
        }
        //上拉加载下一页数据
        this.loadPagingData(this.state.reqParam, false, function(){
            setTimeout(function(){paging.refresh();},300);
            //iframe页面特殊处理
            // appTool.addFrameAevent();
        });
    },
    acDetailInfo: function(e){
        //查看动态详情
        var _this = this;
        var dom = $(e.target);
        var href = dom.data('href');
        var index = dom.data('index');
        var iosdata = {};
        console.log(href,index);
        if(index == 'qa'){
            //问答
            iosdata = appTool.setAppData("我的问答", href, "my_qa_item");
        }else{
            //分享
            iosdata = appTool.setAppData("我的分享", href, "my_share_item");
        }
        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(href);
        }
    },
    render: function () {
        var _this = this;
        var labels = this.state.labels.map(function(o){
            return (
                <span onClick={_this.deleteSelfMark} key={Math.random()}>{o}</span>
            );
        });
        var faceUrl = this.state.systemparam.prefix_pic_thumbnail + '/'+this.state.person.faceimg;
        return (
<PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div ref="personal_body_content" className="personal-body">
                <div className="infomation">
                    <div className="head-img">
                        {
                            this.state.person.faceimg?
                            <img src={faceUrl}/>:null
                        }
                    </div>
                    <div className="name-box">
                        {
                            this.state.user && this.state.user.userid?
                            (this.state.person.nikename || this.state.person.name):
                            <a onTouchStart={this.doLogin}><br/>&nbsp;&nbsp;登录</a>
                        }
                    </div>
                    <div className="mark-title">{this.state.user?'个人标签':null} </div>
                    <div id="infomationMarks" className="marks">
                        {
                            this.state.labels.length?
                            labels:
                            <font>亲，给自己加个标签哇~</font>
                        }
                    </div>
                    {
                        this.state.user.userid?<div className="add-btn" id="man_add_mark">+</div>:null
                    }
                    
                </div>
                <ul className="four-menus">
                    <li>
                        <a id="look_my_buycar_btn">购物车</a>
                    </li>
                    <li>
                        <a id="look_my_order_btn">订单</a>
                    </li>
                    <li>
                        <a id="lijuan_look_btn">礼券</a>
                    </li>
                    <li>
                        <a id="kefu_look_btn">客服</a>
                    </li>
                </ul>
                <div className="segmented-control sc-title-part">
                  <a id="itemQaContent_nav" className="control-item active">
                    我的动态
                  </a>
                  <a id="itemShContent_nav" className="control-item">
                    我的喜欢
                  </a>
                </div>
                <div className="card">
                    {
                        this.state.liketag === 'action'?
                        <span id="itemQaContent" className="control-content active">
                            {
                                this.state.actionlist.length?
                                <PersonalActionList acevent={this.acDetailInfo} path={this.state.systemparam} bridge={this.state.bridge} list={this.state.actionlist} ondelete={this.deleteAcInfo}/>:
                                <ul className="mine-dongtai"><center>亲，去发表个动态吧~</center></ul>
                            }
                        </span>:
                        <span id="itemShContent" className="control-content">
                          <div className="list-control-part">
                            <a name="goods">商品</a>
                            <a name="news">资讯</a>
                            <a name="bbs" className="ac">帖子</a>
                          </div>
                          {
                            this.state.liketag=='bbs'?
                            <div>
                                
                                {
                                    !this.state.shlist.length?
                                    <center className="no-data-tip">暂无数据</center>:
                                    <CommunityShareCom path={this.state.systemparam} list={this.state.shlist} bridge={this.state.bridge}/>
                                }
                            </div>:
                            (
                                this.state.liketag=='goods'?
                                <div className="home-page-body">
                                    {
                                        !this.state.goodlist.length?
                                        <center className="no-data-tip">暂无数据</center>:
                                        <HomeProductList path={this.state.systemparam} goods={this.state.goodlist} bridge={this.state.bridge}/>
                                    }
                                </div>:
                                <div className="news-list-page-body">
                                    
                                    {
                                        !this.state.newslist.length?
                                        <center className="no-data-tip">暂无数据</center>:
                                        <NewsHomeProductList path={this.state.systemparam} newslist={this.state.newslist} bridge={this.state.bridge}/>
                                    }
                                </div>
                            )
                          }
                        
                    </span>
                    }
                    
                </div>
            </div>
            
</PullPaging>
        );
    }
});

var PersonalActionList = React.createClass({
    
    render: function () {
        var _this = this;
        var list = this.props.list.map(function(o){
            //分享
            var myshare_url = "/pages/community_share_item/community_share_item.html?postid="+o.postid+"&fatie_userid="+o.userid;
            // var myshare_iosdata = appTool.setAppData("我的分享", myshare_url, "my_share_item");
            //问答
            var myqa_url = "/pages/community_qa_item/community_qa_item.html?postid="+o.postid+"&fatie_userid="+o.userid;
            // var myqa_iosdata = appTool.setAppData("我的问答", myqa_url, "my_qa_item");
            var myimgUrl = _this.props.path.prefix_pic_thumbnail+'/'+o.imgurl;//构造图片地址
            return (
                <li name={o.postid} key={o.postid + Math.random()}>
                {
                    o.sortid=='2'?
                    <SlideDeleteBox ondelete={_this.props.ondelete}>
                        <div className="img-box">
                            {
                                o.imgurl? <img onClick={_this.props.acevent} data-href={myshare_url} data-index="share" src={myimgUrl}/>:null
                            }
                        </div>
                        <div className="text" onClick={_this.props.acevent} data-href={myshare_url} data-index="share">
                                {o.content}
                        </div>
                    </SlideDeleteBox>:
                    <SlideDeleteBox ondelete={_this.props.ondelete}>
                        <div className="qa-title">
                            <a onClick={_this.props.acevent} data-href={myqa_url} data-index="qa">
                                {o.title}
                            </a>
                        </div>
                        <div className="qa-text">
                            <a onClick={_this.props.acevent} data-href={myqa_url} data-index="qa">
                                {o.content}
                            </a>
                            </div>
                    </SlideDeleteBox>
                }
                </li>
            );
        });
        return (
                <ul className="mine-dongtai">
                    {list}
                </ul>   
        );
    }
});