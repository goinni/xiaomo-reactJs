var AddPinglunPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="gooddetail-page-header">
                  <AlinkBack />
                  <a id="fabiao_pinglun_bbs" className="icon icon-compose pull-right">发表</a>
                  <h1 className="title">添加评论</h1>
            </div>
        );
    }
});
var AddPinglunPageBody = React.createClass({
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
            pageindex: appTool.queryUrlParam('pageindex'),
            bridge: bridge,
            scroll: {}
        }
    },
    componentDidMount: function(){
        var _this = this;
        //oc调用h5
        appTool.ocToH5callback = function(data){
            if(!data.match(/appCacheUserId/)){
                addpinglu();
            }
        }
        appTool.rmPageLoading();//页面加载完成移出提示
        //添加评论
        $('#fabiao_pinglun_bbs').click(addpinglu);
        function addpinglu(){
            //校验是否已登录
            appTool.playLogin(_this.state.bridge, 'addpinglun');
            var a_this = this;
            //添加评论
            var userEntity = appTool.getUserInfoEntity();
            var tx = $('.bbs_add_pinglun_text').val();
            if(!tx){
                iAlert('评论的内容不能为空');
                return false;
            }
            //添加评论
            var tempostid = appTool.queryUrlParam('postid');
            var tempuid = appTool.queryUrlParam('fatie_userid');
            appTool.sendAjax(Uri.community_add_pinglun,{
                "bbsComment.postid": tempostid,
                "bbsComment.replyid": tempuid,
                "bbsComment.content": tx,
                "bbsComment.etype": '1',
                "bbsComment.userid": userEntity.userid
            },function(res){
                //评论成功后返回 
                var oc_url = "";
                if(_this.state.pageindex=='share'){
                    oc_url = "/pages/community_share_item/community_share_item.html?postid="+tempostid+"&fatie_userid="+tempuid+'&pageindex=share';
                    iosdata = appTool.setAppData("分享详情", oc_url, "share", '{"type": "publishSuccess"}');
                }else{
                    oc_url = "/pages/community_qa_item/community_qa_item.html?postid="+tempostid+"&fatie_userid="+tempuid+'&pageindex=qa';
                    iosdata = appTool.setAppData("问答详情", oc_url, "answer", '{"type": "publishSuccess"}');
                }
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    setTimeout(function(){
                        appTool.go(oc_url);
                    },500);
                }
            },function(err){
                iAlert(err);
            });
        }
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    render: function () {
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="add-pinglun-body">
                <div className="tip">(限10000字内)</div>
                <div className="text">
                    <textarea maxLength="10000" className="bbs_add_pinglun_text" placeholder="请输入"></textarea>
                </div>
            </div>
</SimplePageScroll>
        );
    }
});


