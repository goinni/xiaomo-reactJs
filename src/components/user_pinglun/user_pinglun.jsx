var UserPinglunPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="user-pinglun-page-header">
                    <AlinkBack />
                    <h1 className="title">评论</h1>
            </div>
        );
    }
});
var UserPinglunPageBody = React.createClass({
    getInitialState: function(){
        var url = "",pagesize = 10,xparam = {};

        return {
            infoid: appTool.queryUrlParam('infoid'),
            psiid: appTool.queryUrlParam('psiid'),
            goodid: appTool.queryUrlParam('goodid'),
            goodtype: appTool.queryUrlParam('goodtype'),
            systemparam: appTool.getSystemParam(),//获取系统参数
            postUrl: url,
            postParam: xparam,
            pageSize: pagesize,
            currentPage: 1,
            pinglunlist: [],
            iscrollPaging:{}
        }
    },
    getPostData: function(infoid, goodtype, currentPage, pagesize){
        var _this = this;
        if(infoid){
            //资讯评论
            return {
                url: Uri.user_pinglun_list,
                data: {
                    "infoComment.infoid": infoid,
                    "infoComment.currentPage": currentPage || 1,
                    "infoComment.pageSize": pagesize
                }
            };
        }else if(goodtype){
            //商品、保险、服务评论
            
            if(goodtype == "1"){
                //商品
                return {
                    url: Uri.good_pinglun_list,
                    data: {
                        "prodComment.prodid": _this.state.psiid,
                        "prodComment.currentPage":currentPage || 1,
                        "prodComment.pageSize": pagesize
                    }
                };
            }else if(goodtype == "2"){
                //服务
                return {
                    url: Uri.servergood_pinglun_list,
                    data: {
                        "servComment.servid": _this.state.psiid,
                        "servComment.currentPage":currentPage || 1,
                        "servComment.pageSize": pagesize
                    }
                };
            }else if(goodtype == "3"){
                //保险
                return {
                    url: Uri.insugood_pinglun_list,
                    data: {
                        "insureComment.insuid": _this.state.psiid,
                        "insureComment.currentPage": currentPage || 1,
                        "insureComment.pageSize": pagesize
                    }
                };
            }
        }
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(this.state.postUrl, opt,function(res){
             _this.setState({
                currentPage: res.currentPage,
                pinglunlist: isReset ? res.datas : _this.state.pinglunlist.concat(res.datas)
            });
            callback && callback();
        },function(err, status){
            if(status == 2){
                //无数据
                $('.no-data-tip').html('暂无评论数据');
                setTimeout(function(){
                    _this.state.iscrollPaging.refresh();
                    // appTool.toast('亲，已经是最后一页啦~');
                    $('.pullUpLabel').html('亲，已经是最后一页啦~');
                },500);
            }
        });
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示

        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.user-pinglun-body', 0);
        //发表评论
        $('#user_pinglun_bar button').unbind('click').click(function(){
            var user = appTool.getUserInfoEntity();
            if(!user){
                appTool.setLoginBackPage('user_pinglun'); //设置登录成功后跳回的地址
                appTool.go('/pages/login_mobile/login_mobile.html');
                return false;
            }
            var tex = $('#user_pinglun_bar input').val();
            var tempAlert = iAlert({
                text:"评论中...",
                btnshow: false
            });

            var addpinglunUrl = "";
            var addpinglunParm = {};
            if(_this.state.goodtype){
                //商品
                addpinglunUrl = Uri.good_add_pinglun;
                addpinglunParm = {
                    "vmgoods.id": _this.state.goodid,
                    "vmgoods.userid": user.userid,
                    "vmgoods.content": tex
                };
            }else{
                //资讯
                addpinglunUrl = Uri.news_add_pinglun;
                addpinglunParm = {
                    "infoComment.infoid": _this.state.infoid,
                    "infoComment.userid": user.userid,
                    "infoComment.replyid": user.userid,
                    "infoComment.content": tex
                };
            }

            //请求评论
            appTool.sendAjax(addpinglunUrl, addpinglunParm, function(res){
                //评论成功，重新加载评论数据
                var paramData = _this.getPostData(_this.state.infoid, _this.state.goodtype, 1, _this.state.pageSize);
                _this.setState({
                    postUrl: paramData.url,
                    postParam: paramData.data
                });
                _this.loadPagingData(paramData.data,true, function(){
                    setTimeout(function(){
                        tempAlert && tempAlert.remove();
                        _this.state.iscrollPaging.refresh();
                    },500);
                    $('#user_pinglun_bar input').val('');
                });
            },function(err){
                iAlert(err);
            });

        });
    },
    onPullDown: function(paging){
        //按类别构造请求参数
        var paramData = this.getPostData(this.state.infoid, this.state.goodtype, this.state.currentPage, this.state.pageSize);
        
        if(paramData.data['infoComment.currentPage']){
            paramData.data['infoComment.currentPage'] = 1;
        };
        if(paramData.data['prodComment.currentPage']){
            paramData.data['prodComment.currentPage'] = 1;
        };
        if(paramData.data['servComment.currentPage']){
            paramData.data['servComment.currentPage'] = 1;
        };
        if(paramData.data['insureComment.currentPage']){
            paramData.data['insureComment.currentPage'] = 1;
        };

        this.setState({
            postUrl: paramData.url,
            postParam: paramData.data,
            iscrollPaging: paging
        });
        //下拉刷新
        this.loadPagingData(paramData.data, true, function(){
            setTimeout(function(){
                paging.refresh();
            },500);
        });
    },
    onPullUp: function(paging){
        //按类别构造请求参数
        var paramData = this.getPostData(this.state.infoid, this.state.goodtype, this.state.currentPage+1, this.state.pageSize);
        this.setState({
            postUrl: paramData.url,
            postParam: paramData.data,
            iscrollPaging: paging
        });
        //上拉加载下一页数据
        this.loadPagingData(paramData.data,false,function(){
            paging.refresh();
        });
    },
    render: function () {
        if(this.state.infoid || this.state.goodtype){
            //资讯评论查看更多按钮显示 处理
            setTimeout(function(){
                $('#look_more_pinglun_btn').hide();
            },500);
        }
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="user-pinglun-body">
                {
                    this.state.pinglunlist.length? 
                    <UserPingLunPart path={this.state.systemparam} nomore="1" list={this.state.pinglunlist}/>:
                    <center className="no-data-tip">正在加载...</center>
                }
                
            </div>
            </PullPaging>
        );
    }
});

