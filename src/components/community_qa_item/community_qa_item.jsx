var CommunityQaItemPageHeader = React.createClass({
    getInitialState: function(){
        return {
            postid: appTool.queryUrlParam('postid'),
            fatie_userid: appTool.queryUrlParam('fatie_userid')
        }
    },
    componentDidMount:function(){
    },
    render: function () {
        return (
            <div className="communityqa-page-header">
                    <AlinkBack />
                    <h1 className="title">问答详情</h1>
                    <a href={"/pages/addpinglun/addpinglun.html?postid="+this.state.postid+'&fatie_userid='+this.state.fatie_userid} data-transition="slide-in" className="btn btn-link pull-right">回答</a>
            </div>
        );
    }
});
var CommunityQaItemPageBody = React.createClass({
    getInitialState: function(){
        var _this = this , bridge={};
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
            marks:[],
            comments: [],
            mainInfo: {},
            bridge: bridge,
            user: appTool.getUserInfoEntity() || {},
            systemparam: appTool.getSystemParam(),//获取系统参数
            postid: appTool.queryUrlParam('postid'),
            fatie_userid: appTool.queryUrlParam('fatie_userid'),
            scroll: {}
        }
    },
    componentDidMount: function(){
        var _this = this;
        
        //获取问答详情
        appTool.sendPageAjax(Uri.community_detail,{
            "bbsPost.userid": _this.state.user.userid,
            "bbsPost.postid": this.state.postid
        },function(res){
            _this.setState({
                marks: res.labels ? res.labels.split(',') : [],
                comments: res.comments || [],
                mainInfo: res
            });
            appTool.superRemovePageLoading();//页面加载完成移出提示
        },function(err){
            iAlert(err);
        });

        //添加访问量
        appTool.sendAjax(Uri.community_view_count,{
            "bbsPost.postid": this.state.postid,
            "bbsPost.userid": this.state.fatie_userid
        },function(res){
            // console.log(res);
        },function(err){
            iAlert(err);
        });
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        setTimeout(function(){scroll.refresh()},500);
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
        appTool.playLogin(_this.state.bridge, 'community_qa_item');
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
        var _this = this;
        //标签列表
        var marklist = this.state.marks.map(function(o){
            return (
                <li key={Math.random()+o}>{o}</li>
            );
        });
        //评论列表
        var commentslist = this.state.comments.map(function(entity){
            var url = "/pages/com_qa_item_detial/com_qa_item_detial.html?postid="+_this.state.postid+"&userid="+entity.userid+"&comtid="+entity.comtid+"&izaned="+entity.izaned;
            var linkdata = appTool.setAppData("问答详情", url, "com_qa_item_detial");
            var faceUrl = _this.state.systemparam.prefix_pic_thumbnail + '/'+entity.user.faceimg;
            return (
                <ul className="share-user-info-bb" key={entity.postid+Math.random()}>
                    <li>
                        <div className="head-img img-box">
                            {
                                entity.user.faceimg?
                                <img src={faceUrl}/>:
                                <img src={'/assets/default_face.jpg'}/>
                            }
                        </div>
                        <div className="p-name">
                            <b>{entity.user.nikename || entity.user.name}</b>
                            <font>{entity.addtime}</font>
                        </div>
                        <div className="hao-part">
                            <font>{entity.dianzannum || 0}</font>
                            <span className={entity.izaned=='1'?"hao-icon active": "hao-icon"} name={entity.comtid} onTouchEnd={_this.addHao}>&nbsp;</span>
                        </div>
                    </li>
                    <li>
                        <Alink href={url} data={linkdata} bridge={_this.state.bridge}>
                        {entity.content}
                        </Alink>
                    </li>
                </ul>
            );
        });
        return (
            <SimplePageScroll onload={this.pagescrollload}>
            <div className="community-qa-body">
                <div className="main-title">{this.state.mainInfo.title}</div>
                <ul className="marks-part-area">
                    {marklist}
                </ul>
                <div className="main-qa-text">
                    {this.state.mainInfo.content}
                </div>
                <div className="g-pinglun box-area g-ping-box">
                    <div className="g-m-ll">&nbsp;</div>
                    <div className="tex">{this.state.mainInfo.commnum || 0}个答案</div>
                </div>
                <div className="ping-lun-part">
                    {this.state.comments.length? commentslist : <center>亲，暂无评论。</center>}
                </div>
            </div>
            </SimplePageScroll>
        );
    }
});