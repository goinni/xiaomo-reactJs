var ZcResultPageHeader = React.createClass({
    render: function () {
        return (
            <div className="zc-result-page-header">
                <AlinkBack />
                <h1 className="title">健康自测</h1>
            </div>
        );
    }
});
var ZcResultPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, bridge;
        var tizhong = appTool.queryUrlParam('tizhong') || 0,
            shengao = appTool.queryUrlParam('shengao') || 0;
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
            tizhong: parseInt(tizhong),
            shengao: parseInt(shengao),
            selectdata: appTool.queryUrlParam('selectdata'),
            systemparam: appTool.getSystemParam(),//获取系统参数
            bridge: bridge,
            hostGoodlist: [],
            newslist:[],
            scroll: {},
            list:[]
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示

        var sdata = this.state.selectdata;
        
        appTool.sendAjax(Uri.zc_action_mitems,{},function(res){
            var r = [];
            if(sdata.length){
                sdata = sdata.split(',');
                for(var i = 0; i<sdata.length; i++){
                    var item = sdata[i];
                    var kv = item.split('-');
                    for(var j = 0; j<res.length; j++){
                        if(res[j].id == kv[0]){
                            r.push({
                                len: kv[1],
                                entity: res[j]
                            });
                        }
                    }
                    
                }
            }
            _this.setState({
                list: r
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },300);
        },function(err){
            iAlert("获取自测信息失败");
        });

        /**
         * 获取热门商品列表
         */
        appTool.sendPageAjax(Uri.home_hot_good_list,{
            "vmgoods.currentPage":1,
            "vmgoods.pageSize": 4
        },function(res){
            _this.setState({
                hostGoodlist: res.datas
            });
            //热门商品点击事件
            setTimeout(function(){
                _this.state.scroll.refresh();
                $('.product-list-part li').unbind('click').click(function(){
                    var _xt = this;
                    var oid = $(_xt).data('oid');
                    var oname = $(_xt).data('oname');
                    var oc_url = "/pages/gooddetail/gooddetail.html?goodid="+oid+"&goodname="+oname;
                    var iosdata = appTool.setAppData(oname, oc_url, "share");
                    //IOS通信回调
                    appTool.sendAppData(_this.state.bridge, iosdata);
                    if(!appTool.hasAppBridge(_this.state.bridge)){
                        appTool.go(oc_url);
                    }
                });
            },500);
        },function(err){
            // iAlert(err);
        });

        //加载资讯列表
        appTool.sendPageAjax(Uri.news_good_list,{
            "info.currentPage": 1,
            "info.pageSize": 2
        },function(res){
            _this.setState({
                newslist: res.datas
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
                $('.news-product-list li').unbind('click').click(function(){
                    var _xt = this;
                    var oinfoid = $(_xt).data('oinfoid');
                    var oname = $(_xt).data('oname');
                    var oc_url = '/pages/news_detail/news_detail.html?infoid='+oinfoid;
                    var iosdata = appTool.setAppData(oname, oc_url, "share");

                    //IOS通信回调
                    appTool.sendAppData(_this.state.bridge, iosdata);
                    if(!appTool.hasAppBridge(_this.state.bridge)){
                        appTool.go(oc_url);
                    }
                });
            },500);

        },function(err, stauts){
            //err
        });
        //重新测试
        $('#zc-reslut-bar-btn .pull-left').click(function(){
            var oc_url = "/pages/zc_home/zc_home.html";
            var iosdata = appTool.setAppData("个人自测", oc_url, "zc_home");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        //退出进入首页
        $('#zc-reslut-bar-btn .pull-right').click(function(){
            //去首页
            appTool.goHomePage(_this.state.bridge);
        });
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    render: function () {
        var _this = this;
        var rlist = this.state.list.map(function(o){
            return (
                <div key={o.entity.id+Math.random()}>
                    <div className="tip-tex no-marg">
                        {o.entity.name}
                        <div>&nbsp;</div>
                    </div>
                    <div className="ti-desc">
                    分析：
                    {o.len>3? o.entity.gt_three : o.entity.lt_three}
                    </div>
                    {
                        o.len>3?
                        <div className="tip-tex ps-text">
                            您缺少的营养元素：<font>{o.entity.elements}</font>
                        </div>: null 
                    }
                    
                </div>
            );
        });
        //BIM 公式 体重（公斤）/身高的平方
        var bim = this.state.tizhong/Math.pow((this.state.shengao/100),2);
        var bimindex = "";
        if(bim<18){
            bimindex = "您的BMI身体质量指数为"+bim.toFixed(2)+"（BMI低于18为轻体重状态），推测您在日常生活中可能营养不良，容易引发贫血、易疲劳、体力不支等症状。建议您及时补充身体营养元素，合理调整膳食结构，同时辅以运动，增强自身免疫力。";
        }
        if(bim > 18){
            bimindex = "您的BMI身体质量指数为"+bim.toFixed(2)+"（BMI的标准值范围为18-24.99），属于理想情况，希望您继续保持下去！";
        }
        if(bim > 25){
            bimindex = "您的BMI身体质量指数为"+bim.toFixed(2)+"（BMI大于等于25为偏重状态），推测您在日常生活中可能新陈代谢紊乱，容易导致高血压、高血脂、高血糖（也就是俗称的“三高”问题），疲乏无力、呼吸急促、呼吸困难、关节酸疼等病症。建议您及时减重，远离慢性疾病的困扰，同时调整膳食结构，补充促进代谢、帮助减脂的营养元素，同时辅以运动，保养关节，增强自身免疫力。";
        }
        if(bim > 28){
            bimindex = "您的BMI身体质量指数为"+bim.toFixed(2)+"（BMI大于等于28为肥胖状态），建议您管控自己的体重并及时咨询医生。";
        }

        //热门商品
        var hotgoodlist = this.state.hostGoodlist.map(function(o){
            var imgUrl = _this.state.systemparam.prefix_pic_thumbnail + '/'+o.imgurl;
            return (
                <li key={o.id+Math.random()} data-oid={o.id} data-oname={o.name}>
                    <div className="img-box">
                        {o.imgurl? <img src={imgUrl}/>: null}
                        
                    </div>
                    <p>{o.name}</p>
                    <div className="price">
                        <span>{'￥'+o.saleprice}</span>
                        <font>{'￥'+o.refeprice}</font>
                    </div>
                    <div className="small-count-part">
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
            );
        });

        //加载资讯列表 
        var newsdatalist = this.state.newslist.map(function(o){
            var imgUrl = _this.state.systemparam.prefix_pic_thumbnail+'/'+o.imgurl;//构造图片地址
            return (
                <li key={o.infoid+Math.random()} data-oinfoid={o.infoid} data-oname={o.title} className="img-box top-banner">
                    {o.imgurl? <img src={imgUrl}/>: null}
                    <p>{o.title}</p>
                    <div className="like">
                        {o.likenum || 0}
                    </div>
                </li>
            );
        });

        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="zc-result-body">
                <div className="banner"> 
                    <div className="z-tip-s">
                        <div className="st-tex">您的<font>BMI</font>指数</div>
                        <div className="st-big-tex">
                            {bim.toFixed(2)}
                        </div>
                    </div>
                    <ul className="line-style">
                        <li>
                            <div className="tipbg">&nbsp;</div>
                            <div className="tiptex">小于18</div>
                        </li>
                        <li>
                            <div className="tipbg">&nbsp;</div>
                            <div className="tiptex">大于18</div>
                        </li>
                        <li>
                            <div className="tipbg">&nbsp;</div>
                            <div className="tiptex">大于25</div>
                        </li>
                        <li>
                            <div className="tipbg">&nbsp;</div>
                            <div className="tiptex">大于28</div>
                        </li>
                    </ul>
                </div>
                <div className="tip-tex">
                    BMI测试结果
                    <div>&nbsp;</div>
                </div>
                <div className="ti-desc xtdirver">
                    {bimindex}
                </div>

                {rlist}

                <div className="tip-tex">
                    推荐阅读
                    <div>&nbsp;</div>
                </div>
                <div className="news-home-page-body">
                    <ul className="news-product-list">
                        {newsdatalist}
                    </ul>
                </div>
                <div className="tip-tex fenhong">
                    推荐使用
                    <div>&nbsp;</div>
                </div>
                <ul className="product-list-part">
                    {hotgoodlist}
                </ul>
            </div>
</SimplePageScroll>
        );
    }
});


