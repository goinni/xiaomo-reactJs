var CommunityWindowPageHeader = React.createClass({
    getInitialState: function(){
        return {
            title: "小陌社区"
        }
    },
    componentDidMount:function(){
        $('.share-qa-btn-play').click(function(){
                //校验登录
                // appTool.playLogin('community_myframe');
              var bg = $('<div class="masker-bg-tip">');
              var gx = $('<div class="gx-btns">');
              var wd = $('<a data-transition="slide-in">').html('发表问答');
              var fx = $('<a data-transition="slide-in">').html('发表分享');

              wd.click(function(){
                // console.log("发表问答");
                delbox();
                $(this).attr('href',"/pages/fa_wen/fa_wen.html?sortid=1");
              });
              fx.click(function(){
                // console.log("发表分享");
                delbox();
                $(this).attr('href',"/pages/fa_tei/fa_tei.html?sortid=2");
              });
              gx.append(wd).append(fx);
              bg.append(gx);
              var ch = $('<div class="ch-btn">').click(function(){
                            delbox();
                          }).html('取消');
              bg.append(ch);
              $('body').append(bg);
              //删除遮罩
              function delbox(){
                $('.masker-bg-tip').empty().remove();
              }
        });
    },
    render: function () {
        return (
            <div className="community-window-page-header">
                <AlinkBack />
                <h1 className="title">{this.state.title}</h1>
                <a className="btn btn-link btn-nav pull-right share-qa-btn-play">
                    <span className="icon icon-left-nav"></span>
                </a>
            </div>
        );
    }
});
var CommunityWindowPageBody = React.createClass({
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
            shlist: [],
            qalist:[],
            bbsindex: appTool.localGet('_community_win_index'),//appTool.queryUrlParam('bbsindex') || 
            reqParam:{
                "bbsPost.currentPage": 1,
                "bbsPost.pageSize": 10,
                'bbsPost.sortid': 1   //默认加载问答
            },
            currentPage: 1,
            pageSize: 10,
            liketag: 'qa',
            scroll: {},
            systemparam: appTool.getSystemParam(),//获取系统参数
            pagingUrl: Uri.community_qa_list,
            bridge: bridge
        }
    },
    componentDidMount: function(){
        var _this = this;
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.community-window-body', 44);
        // appTool.rmPageLoading();//页面加载完成移出提示
        if(this.state.bbsindex == 'share'){
            //发表完分享后，设置页面显示分享内容
            showShare();
            $('<div class="community-window-nav-title"><ul><li name="1">问答</li><li name="2" class="active">分享</li></ul></div>').appendTo('body');
        }else{
            $('<div class="community-window-nav-title"><ul><li name="1" class="active">问答</li><li name="2">分享</li></ul></div>').appendTo('body');
        }

        function showQa(){
            appTool.localSet('_community_win_index', "qa"); //设置当前为问答
            _this.setState({
                liketag: 'qa',
                shlist:[],
                reqParam:{
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 1
                },
                pagingUrl: Uri.community_qa_list
            });
        }
        function showShare(){
            appTool.localSet('_community_win_index', "share"); //设置当前为分享
            _this.setState({
                liketag: 'share',
                qalist: [],
                reqParam:{
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 2
                },
                pagingUrl: Uri.community_share_list
            });
        }
        $('.community-window-nav-title li').click(function(){
            $('.community-window-nav-title li.active').removeClass('active');
            $(this).addClass('active');
            var indexName = $(this).attr('name');
            if(indexName == '1'){
                //问答
                showQa();
            }else {
                //分享
                showShare();
            }
            _this.onPullDown(_this.state.scroll);
        });
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(_this.state.pagingUrl, opt,function(res){
            var name = _this.state.liketag;
            if(name === 'qa'){
                _this.setState({
                    currentPage: res.currentPage,
                    qalist: isReset ? res.datas : _this.state.qalist.concat(res.datas)
                });
            }else {
                _this.setState({
                    currentPage: res.currentPage,
                    shlist: isReset ? res.datas : _this.state.shlist.concat(res.datas)
                });
            }
            callback && callback();
            //删除提示
            appTool.superRemovePageLoading();
        },function(err,status){
            if(status == 2){
                // 无数据
                $('.no-data-tip-box').show();
                appTool.superRemovePageLoading();
                _this.state.scroll.refresh();
            }else{
                iAlert(err);
            }
        });
    },
    onPullDown: function(paging){
        var _this = this;
        this.setState({
            scroll: paging
        });
        if(this.state.liketag == 'qa'){
            //问答
            _this.setState({
                reqParam:{
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 1
                }
            });
        }else {
            //分享
            _this.setState({
                reqParam:{
                    "bbsPost.currentPage": 1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 2
                }
            });
        }
        //下拉刷新
        this.loadPagingData(_this.state.reqParam, true, function(){
            setTimeout(function(){
                _this.state.scroll.refresh();
                //iframe页面特殊处理
                // appTool.addFrameAevent();   
            },200);
        });
        
    },
    onPullUp: function(paging){
        var _this = this;
        this.setState({
            scroll: paging
        });
        if(this.state.liketag == 'qa'){
            //问答
            _this.setState({
                reqParam:{
                    "bbsPost.currentPage": _this.state.currentPage+1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 1
                }
            });
        }else {
            //分享
            _this.setState({
                reqParam:{
                    "bbsPost.currentPage": _this.state.currentPage+1,
                    "bbsPost.pageSize": _this.state.pageSize,
                    'bbsPost.sortid': 2
                }
            });
        }
        this.loadPagingData(_this.state.reqParam, false, function(){
            setTimeout(function(){
                _this.state.scroll.refresh();
                //iframe页面特殊处理
                // appTool.addFrameAevent();   
            },200);
        });
    },
    render: function () {
        //community-page-body
        return (
<PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
    <div className="community-window-body community-body">
            <div className="card">
                {
                    this.state.liketag=='share'?
                    <span id="communityItemShareContent" className="control-content active"> 
                        {
                            this.state.shlist.length?
                            <CommunityShareCom path={this.state.systemparam} list={this.state.shlist} bridge={this.state.bridge}/>:
                            <center className="no-data-tip-box">暂无数据</center>
                        }
                    </span>:
                    <span id="communityItemQaContent" className="control-content active">
                        {
                            this.state.qalist.length?
                            <CommunityQaCom path={this.state.systemparam} list={this.state.qalist} bridge={this.state.bridge}/>:
                            <center className="no-data-tip-box">暂无数据</center>
                        }
                    </span>
                }
            </div>
    </div>
</PullPaging>
        );
    }
});


