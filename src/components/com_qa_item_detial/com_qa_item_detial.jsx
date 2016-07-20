var CommunityQaItemDetailPageHeader = React.createClass({
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="communityqa-detail-page-header">
                    <AlinkBack />
                    <h1 className="title">回答详情</h1>
            </div>
        );
    }
});
var CommunityQaItemDetailPageBody = React.createClass({
    getInitialState: function(){
        var bridge = {},_this = this;
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
            bridge: bridge,
            izaned: appTool.queryUrlParam('izaned'),
            postid: appTool.queryUrlParam('postid'),
            userid: appTool.queryUrlParam('userid'),
            comtid: appTool.queryUrlParam('comtid') || '',
            systemparam: appTool.getSystemParam(),//获取系统参数
            detail: {},
            scroll: {}
        };
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        //获取 评论详情
        appTool.sendAjax(Uri.pinglun_action_itemdetail,{
            "bbsComment.comtid": _this.state.comtid
        },function(res){
            _this.setState({
                detail: res
            });
        },function(err){
            iAlert(err);
        });
    },
    pagescrollload:function(scroll){
        this.state.scroll = scroll;
        scroll.refresh();
    },
    addHao: function(e){
        var _this = this;
        var elem = e.target;
        var haodom = $(elem);
        var num = parseFloat(haodom.parent().find('font').html());
        var flag = haodom.hasClass('active');
        if(!flag){
            haodom.parent().find('font').html(num+1);
            haodom.addClass('active');
        }else{
            haodom.parent().find('font').html(num-1);
            haodom.removeClass('active');
        }
        //点了就累加 赞
        var userEntity = appTool.getUserInfoEntity() || {};
        //校验是否已登录
        appTool.playLogin(_this.state.bridge, 'com_qa_item_detial');
        appTool.sendAjax(Uri.community_add_like,{
            "bbsComment.comtid": haodom.attr('name'),
            "bbsComment.userid": userEntity.userid || ''
        },function(res){
            // console.log(res);
        },function(err){
            // iAlert(err);
        });
    },
    render: function () {
        var tmpUser = this.state.detail.user || {};
        var faceUrl = this.state.systemparam.prefix_pic_thumbnail + '/'+tmpUser.faceimg;
        return (
        <SimplePageScroll onload={this.pagescrollload}>
            <div className="community-qa-detail-body">
                <div className="ping-lun-part">
                    <ul className="share-user-info-bb">
                        <li>
                            <div className="head-img img-box">
                                {
                                    tmpUser.faceimg? <img src={faceUrl}/>: null
                                }
                            </div>
                            <div className="p-name">
                                <b>{tmpUser.nikename || tmpUser.name}</b>
                                <font>{this.state.detail.addtime}</font>
                            </div>
                            <div className="hao-part">
                                <font>{this.state.detail.dianzannum || 0}</font>
                                <span className={this.state.izaned=='1'?"hao-icon active": "hao-icon"} name={this.state.comtid} onTouchEnd={this.addHao}>&nbsp;</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="main-title">{this.state.detail.bbsPost&&this.state.detail.bbsPost.title}</div>
                <div className="main-qa-text">
                    {this.state.detail.content}
                </div>
            </div>
        </SimplePageScroll>
        );
    }
});