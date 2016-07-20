var NotiyListPageHeader = React.createClass({
    componentDidMount:function(){
    },
    onSearchEv: function(){
        //搜索事件
    },
    render: function () {
        return (
            <div className="notiy-list-page-header">
                <AlinkBack />
                <h1 className="title">通知</h1>
            </div>
        );
    }
});
var NotiyListPageBody = React.createClass({
    getInitialState: function(){
        
        return {
            pageSize: 10,
            currentPage: 1,
            user: appTool.getUserInfoEntity() || '',
            msglist:[],
            scroll: {},
            bridge:{}
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.notify_msg_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                msglist: isReset ? res.datas : _this.state.msglist.concat(res.datas)
            });
            // console.log(res.userMsg,res.msgeid);//用户消息对象，如果为空，证明未读
            
            //下拉刷新上拉加载回调用
            callback && callback();

        },function(errmsg, stauts){
            if(stauts == 2){
                //无数据
                $('.no-data-tip').html('暂无消息通知');
                setTimeout(function(){
                    _this.state.scroll.refresh();
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },200);
            }
        });
    },
    componentDidMount: function(){
        var _this =this;
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.notify-list', 44);
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
        });

        appTool.rmPageLoading();//页面加载完成移出提示 
    },
    onPullDown: function(paging){
        var _this = this;
        this.setState({
            scroll: paging
        });
        var userEntity = appTool.getUserInfoEntity();
        if(!userEntity){
            $('.notify-list').empty().append("<center>用户信息不存，或请登录后再查看</center>");
            return false;
        }
        //下拉刷新
        this.loadPagingData({
            "sysMsg.userid":userEntity.userid,
            "sysMsg.currentPage": 1,
            "sysMsg.pageSize": _this.state.pageSize
        }, true, function(){
            setTimeout(function(){
                paging.refresh();
                //设置消息为已读
                var dlist = _this.state.msglist;
                for(var n = 0; n<dlist.length; n++){
                    if(!dlist[n].userMsg || dlist[n].userMsg && dlist[n].userMsg.readflag=='0'){
                        appTool.sendAjax(Uri.notify_msg_readed,{
                            "userMsg.userid": _this.state.user.userid,
                            "userMsg.msgeid": dlist[n].msgeid
                        },function(res){
                            // console.log(res);
                            // appTool.toast('消息已读');
                            // $(lit).removeClass('active');
                        },function(err){
                            // iAlert(err);
                        });
                    }
                }
            },500);
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        var _this = this;
        var userEntity = appTool.getUserInfoEntity();
        if(!userEntity){
            $('.notify-list').empty().append("<center>用户信息不存，或请登录后再查看</center>");
            return false;
        }
        //下拉刷新
        this.loadPagingData({
            "sysMsg.userid": userEntity.userid,
            "sysMsg.currentPage": parseFloat(_this.state.currentPage)+1,
            "sysMsg.pageSize": _this.state.pageSize
        }, false, function(){
            setTimeout(function(){paging.refresh()},500);
        });
    },

    render: function () {
        
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
                <NotiyListMessages bridge={this.state.bridge} list={this.state.msglist}/>
            </PullPaging>
        );
    }
});
var NotiyListMessages = React.createClass({
    componentDidMount:function(){
    },
    onSearchEv: function(){
        //搜索事件
    },
    render: function () {
        var _this = this;
        var list = this.props.list.map(function(o){
            var linkdata = {
                title: "消息",
                url: '', 
                type: 'notifyMsg'
            }
            return (
                <li key={o.addtime+Math.random()} data-meid={o.msgeid} className={o.userMsg?'':'active'}>
                    <div className="time">{o.addtime}</div>
                    <div className="text" dangerouslySetInnerHTML={{__html:(o.summary || o.content)}}>
                    </div>
                </li>
            );
        });
        return (
            <ul className="notify-list">
                {
                    this.props.list.length ? list :<center className="no-data-tip">正在加载...</center>
                }
            </ul>
        );
    }
});

