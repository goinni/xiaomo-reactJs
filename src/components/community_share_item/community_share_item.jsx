var CommunityShareItemPageHeader = React.createClass({
    render: function () {
        return (
            <div className="communityshare-page-header">
                    <AlinkBack />
                    <h1 className="title">分享详情</h1>
            </div>
        );
    }
});
var CommunityShareItemPageBody = React.createClass({
    getInitialState: function(){
        var marks = [], comments=[], mainInfo=[], postid = appTool.queryUrlParam('postid'),fatie_userid=appTool.queryUrlParam('fatie_userid');
        var userEntity = appTool.getUserInfoEntity() || {};
        //获取问答详情
        appTool.sendPageAjax(Uri.community_detail,{
            "bbsPost.userid": userEntity.userid,
            "bbsPost.postid": postid
        },function(res){
            marks = res.labels ? res.labels.split(',') : [];
            comments = res.comments || [];
            mainInfo = res;
            appTool.superRemovePageLoading();//页面加载完成移出提示
        },function(err){
            if(mainInfo.length!="0"){
                iAlert(err);
            }else{
                //删除提示
                appTool.superRemovePageLoading();
            }
        },null, null, false);

        //统计访问量
        appTool.sendAjax(Uri.community_view_count,{
            "bbsPost.postid": postid,
            "bbsPost.userid": fatie_userid
        },function(res){
            // console.log(res);
        },function(err){
            // iAlert(err);
        });

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
            bridge: bridge,
            marks: marks,
            comments: comments,
            mainInfo: mainInfo,
            systemparam: appTool.getSystemParam(),//获取系统参数
            postid: postid,
            fatie_userid: fatie_userid,
            scroll:{}
        }
    },
    componentDidMount: function(){
        var _this = this;
        var commBox = $('#news-xin-pinglun .pull-right');
        commBox.find('span').eq(1).html(this.state.mainInfo.commnum || 0);

        commBox.unbind('click').click(function(){
            var oc_url = '/pages/addpinglun/addpinglun.html?postid='+_this.state.postid+'&fatie_userid='+_this.state.fatie_userid+'&pageindex=share';
            var iosdata = appTool.setAppData("评论", oc_url, "publish");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        //收藏数据回显
        if(this.state.mainInfo.icoled){
            $('#news-xin-pinglun .xin-a').addClass('active');
        }else{
            $('#news-xin-pinglun .xin-a').removeClass('active');
        }
        //设置收藏个数
        $('#news-xin-pinglun .xin-a').find('span').eq(1).html(this.state.mainInfo.likenum || 0);
        //喜欢切换
        $('#news-xin-pinglun .xin-a').click(function(){
            var user = appTool.getUserInfoEntity();
            var _this_a = this;
            //校验登录
            appTool.playLogin(_this.state.bridge, 'community_share_item');
            //添加喜欢
            appTool.sendAjax(Uri.community_bbs_my_like,{
                "bbsPost.postid": _this.state.postid,
                "bbsPost.userid": user.userid
            },function(res){
                var sp = $(_this_a).find('span').eq(1);
                    var n = parseFloat(sp.html());
                if($(_this_a).hasClass('active')){
                    sp.html(n-1);
                }else{
                    sp.html(n+1);
                }
                $(_this_a).toggleClass('active');
            },function(err){
                iAlert(err);
            });
            
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
        appTool.playLogin(_this.state.bridge, 'community_share_item');
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
        //标签列表
        var marklist = this.state.marks.map(function(o){
            return (
                <li key={Math.random()+o}>{o}</li>
            );
        });
        if(this.state.mainInfo.length===0){
            return(
                <center>该贴已被删除</center>
            );
        };
        var faceUrl = this.state.systemparam.prefix_pic_thumbnail + '/'+this.state.mainInfo.user.faceimg;
        var mainimgUrl = this.state.systemparam.prefix_pic_thumbnail + '/'+this.state.mainInfo.imgurl;
        return (
            <SimplePageScroll onload={this.pagescrollload}>
            {
                    this.state.mainInfo.length===0?
                    <center>该贴已被删除</center>:
                    <div className="community-share-body">
                        <ul className="share-user-info-bb">
                            <li>
                                <div className="head-img img-box">
                                    {
                                        this.state.mainInfo.user.faceimg?
                                        <img src={faceUrl}/>:
                                        <img src={'/assets/default_face.jpg'}/>
                                    }
                                </div>
                                
                                <div className="p-name">
                                    <b>{this.state.mainInfo.user.nikename || this.state.mainInfo.user.name}</b>
                                    <font>{this.state.mainInfo.addtime}</font>
                                </div>
                                <div className="small-count-part">
                                    <button className="btn btn-link">
                                      <span className="icon icon_eye"></span>
                                      {this.state.mainInfo.viewnum || 0}
                                    </button>
                                    <button className="btn btn-link">
                                      <span className="icon icon_heart"></span>
                                      {this.state.mainInfo.likenum || 0}
                                    </button>
                                    <button className="btn btn-link">
                                      <span className="icon icon_speak"></span>
                                      {this.state.mainInfo.commnum || 0}
                                    </button>
                                </div>
                            </li>
                        </ul>

                        <ul className="marks-part-area">
                            {marklist}
                        </ul>

                        <div className="main-title">{this.state.mainInfo.title}</div>
                        
                        <div className="main-share-text">
                            {this.state.mainInfo.content}
                            {
                                this.state.mainInfo.imgurl? 
                                <img style={{width:'100%'}} src={mainimgUrl}/>: null
                            }
                        </div>
                        <div className="g-pinglun box-area g-ping-box">
                            <div className="g-m-ll">&nbsp;</div>
                            <div className="tex">用户评论</div>
                        </div>
                        {
                            this.state.comments.length ?
                            <CommunityShareItemCommentslist path={this.state.systemparam} bridge={this.state.bridge} postid={this.state.postid} comments={this.state.comments} addHao={this.addHao}/> :
                            <center>亲，暂无评论。</center>
                        }
                    </div>
            }
            
            </SimplePageScroll>
        );
    }
});

var CommunityShareItemCommentslist = React.createClass({
    render: function () {
        var _this = this;
        
        //评论列表
        var commentslist = this.props.comments.map(function(entity){
            var url = "/pages/com_qa_item_detial/com_qa_item_detial.html?postid="+_this.props.postid+"&userid="+entity.userid+"&comtid="+entity.comtid+"&izaned="+entity.izaned;
            var linkdata = appTool.setAppData("评论详情", url, "com_qa_item_detial");
            var faceUrl = _this.props.path.prefix_pic_thumbnail + '/'+entity.user.faceimg;
            return (
                <ul className="share-user-info-bb" key={entity.postid+Math.random()}>
                    <li>
                        <div className="head-img img-box">
                            {
                                entity.user.faceimg ?
                                <img src={faceUrl}/> :
                                <img src={'/assets/default_face.jpg'}/>
                            }
                        </div>
                        <div className="p-name">
                            <b>{entity.user.nikename || entity.user.name}</b>
                            <font>{entity.addtime}</font>
                        </div>
                        <div className="hao-part">
                            <font>{entity.dianzannum || 0}</font>
                            <span className={entity.izaned=='1'?"hao-icon active": "hao-icon"} name={entity.comtid} onTouchStart={_this.props.addHao}>&nbsp;</span>
                        </div>
                    </li>
                    <li>
                        <Alink href={url} data={linkdata} bridge={_this.props.bridge}>
                            {entity.content}
                        </Alink>
                    </li>
                </ul>
            );
        });
        return (
            <div className="ping-lun-part">
                {commentslist}
            </div>
        );
    }
});




