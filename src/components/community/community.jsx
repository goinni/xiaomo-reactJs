var CommunityPageHeader = React.createClass({
    getInitialState: function(){
        $('body').addClass('no-timer-top-bar');//设置顶部没有时间工具条样式
        return {};
    },
    render: function () {
        return (
            <div className="community-page-header">
                <h1 className="title">小陌社区</h1>
                <a className="btn btn-link btn-nav pull-right share-qa-btn-play">
                    <span className="icon icon-left-nav"></span>
                </a>
            </div>
        );
    }
});
var CommunityPageBody = React.createClass({
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
            sortid: 1,
            currentPage: 1,
            pageSize: 10,
            qalist: [],
            bridge: bridge,
            shlist: []
        }
    },
    componentDidMount: function(){
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.community-body',0);
    },
    loadPagingData: function(param,isReset,callback){
        var _this = this, opt=param || {},list=[];
        appTool.sendPageAjax(Uri.community_qa_list,opt,function(res){
            _this.setState({
                currentPage: res.currentPage,
                qalist: isReset ? res.datas : _this.state.qalist.concat(res.datas)
            });
            callback && callback();
        });
    },
    onPullDown: function(paging){
        //下拉刷新
        this.loadPagingData({
            "bbsPost.currentPage": 1,
            "bbsPost.pageSize": this.state.pageSize,
            'bbsPost.sortid': this.state.sortid
        },true, function(){
            setTimeout(function(){paging.refresh()},500);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    onPullUp: function(paging){
        //上拉加载下一页数据
        this.loadPagingData({
            "bbsPost.currentPage": this.state.currentPage+1,
            "bbsPost.pageSize": this.state.pageSize,
            'bbsPost.sortid': this.state.sortid
        },false,function(){
            setTimeout(function(){paging.refresh()},500);
            //iframe页面特殊处理
            appTool.addFrameAevent();
        });
    },
    render: function () {
        return (
            <PullPaging onPullDown={this.onPullDown} onPullUp={this.onPullUp}>
            <div className="community-body">
                <div className="card">
                  <span id="communityItemQaContent" className="control-content active">
                        <CommunityQaCom list={this.state.qalist} bridge={this.state.bridge}/>
                  </span>
                </div>
            </div>
            </PullPaging>
        );
    }
});
/**
 * 问答组件 
 */
var CommunityQaCom = React.createClass({
    render: function () {
        var _this = this;
        var qalist = this.props.list.map(function(o){
            var comments = o.comments || [];
            var user = {};
            if(comments.length){
                user = comments[0].user;
            }
            var url = "/pages/community_qa_item/community_qa_item.html?postid="+o.postid+"&fatie_userid="+o.userid+'&pageindex=qa';
            var linkdata = appTool.setAppData("问答详情", url, "answer");
            var faceUrl = _this.props.path.prefix_pic_thumbnail + '/'+ user.faceimg;
            return (
                <ul key={o.postid+Math.random()}>
                    {
                      comments.length?  <li>
                                            <b>{user.nikename || user.name}</b>
                                            <font>回答了这个问题</font>
                                            <div className='img-box head-img'>
                                                {
                                                    user.faceimg?
                                                    <img src={faceUrl}/>:null
                                                }
                                            </div>
                                        </li>:  
                                        <li>
                                            <font>{'沙发，快来啊~'}</font>
                                        </li>
                    }
                    <li>
                        <Alink href={url} data={linkdata} bridge={_this.props.bridge}>
                        {o.title}
                        </Alink>
                    </li>
                    <li>
                        <table>
                            <tbody><tr>
                                <td><span className="badge badge-primary">{o.comments.length&&o.comments[0].dianzannum || 0}</span></td>
                                <td>
                                    <Alink href={url} data={linkdata} bridge={_this.props.bridge}>
                                    {o.comments.length&&o.comments[0].content || o.content}
                                    </Alink>
                                </td>
                            </tr></tbody>
                        </table>
                    </li>
                </ul>
            );
        });        
        return (
                <div className="x-qa-list-part">
                    {qalist}
                </div>
        );
    }
});
/**
 * 分享组件
 */
var CommunityShareCom = React.createClass({
    acShareDetailInfo: function(e){
        //查看资讯详情
        var _this = this;
        var dom = $(e.target);
        var href = dom.data('href');
        var linkdata = appTool.setAppData("分享详情", href, "share");

        //IOS通信回调
        appTool.sendAppData(_this.props.bridge, linkdata);
        if(!appTool.hasAppBridge(_this.props.bridge)){
            appTool.go(href);
        }
    },
    render: function () {
        var _this = this;
        var tempUser = appTool.getUserInfoEntity()||{};
        var shlist = this.props.list.map(function(o){
            var comments = o.comments || [];
            var user = o.user;
            var url = "/pages/community_share_item/community_share_item.html?postid="+(o.postid || o.entityid)+"&fatie_userid="+tempUser.userid+'&pageindex=share';
            // var linkdata = appTool.setAppData("分享详情", url, "share");
            var faceUrl = _this.props.path.prefix_pic_thumbnail + '/'+ user.faceimg;
            var shimgurl = _this.props.path.prefix_pic_thumbnail + '/'+ o.imgurl;

            return (
                <ul className="share-user-info-bb" key={(o.postid || o.entityid)+Math.random()}>
                    <li>
                        <div className="head-img img-box">
                            {
                                user.faceimg? 
                                <img src={faceUrl}/>:null
                            }
                        </div>
                        <div className="p-name">
                            <b>{user.nikename || user.name}</b>
                            <font>{o.addtime}</font>
                        </div>

                        <div className="small-count-part">
                            <button className="btn btn-link">
                              <span className="icon icon_eye"></span>
                              {o.viewnum || 0}
                            </button>
                            <button className="btn btn-link">
                              <span className="icon icon_heart"></span>
                              {o.likenum || 0}
                            </button>
                            <button className="btn btn-link">
                              <span className="icon icon_speak"></span>
                              {o.commnum || 0}
                            </button>
                        </div>
                    </li>
                    <li>
                        <a onClick={_this.acShareDetailInfo} data-href={url}>
                            {o.content}
                        </a>
                    </li>
                    {
                        o.imgurl? <li className="img-box">
                                        <a>
                                            {
                                                o.imgurl? <img onClick={_this.acShareDetailInfo} data-href={url} src={shimgurl}/>: null
                                            }
                                        </a>
                                    </li>: null
                    }
                </ul>
            );
        });        
        return (
            <div className="x-share-list-part">
                {shlist}
            </div>
        );
    }
});

