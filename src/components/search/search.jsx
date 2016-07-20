var SearchPageHeader = React.createClass({
    componentDidMount:function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="search-page-header">
                <a className="icon icon-search pull-left"></a>
                <a href="/pages/home/home.html" data-transition="slide-in" className="btn btn-link pull-right">取消</a>
                <h1 className="title">
                    <form action="#">
                    <input className="nav-search-input" type="search" placeholder="搜索关键字"/>
                    </form>
                </h1>
            </div>
        );
    }
});

var SearchPageBody = React.createClass({
    getInitialState: function(){
        var bridge={},_this = this;

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
            hotmarks: [],
            searchlist:[]
        };
    },
    componentDidMount: function(){
        var _this = this;
        $(".nav-search-input").on('input propertychange',function(){

            appTool.sendAjax(Uri.search_goods,{},function(res){
                $(".hot-key-place").hide(); //热门标签隐藏
                $(".search-result").show(); //搜索结果显示 
                _this.setState({
                    searchlist: res.datas
                });
            },function(err){
                iAlert("search-result loaded error");
            });

        }).focus();
        // 热门标签
        appTool.sendAjax(Uri.search_hot_marks,{
            "label.hotflag": 1,
            "label.delflag": 0
        },function(res){ 
            _this.setState({
                hotmarks: res || []
            });
        },function(err){
            // iAlert(err);
            $('.no-data-tip').html('暂无热门标签');
        });
    },
    showmarkdetail: function(e){
        //标签详情
        var _this = this;
        var oname = $(e.target).data('oname');
        var oc_url = "/pages/mark_detail/mark_detail.html?title="+oname;
        var iosdata = appTool.setAppData(oname, oc_url, "mark_detail");
        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(oc_url);
        }
    },
    render: function () {
        var _this = this;
        var lis = null;
        //搜索
        // var lis = this.state.searchlist.map(function(o){
        //     var marklist = o.marks.map(function(m){
        //         return (
        //             <a key={m.id} className="mark" href="#"><span>{m.name}</span></a>
        //         );
        //     });
        //     return (
        //         <li key={o.id}>
        //             <a data-transition="slide-in"  href="/pages/news/news.html">{o.name}</a>
        //             {marklist}
        //         </li>
        //     );
        // });
        // 标签
        var marklist = this.state.hotmarks.map(function(o){
            return (
                <li key={o.labeid}>
                    <a onClick={_this.showmarkdetail} data-oname={o.name}>{o.name}</a>
                </li>
            );
        });
        return (
            <div className="search-place-part">
                <div className="hot-key-place">
                  <p>热门标签</p>
                  <ol>
                    {this.state.hotmarks.length? marklist: <center className="no-data-tip">正在加载...</center>}
                  </ol>  
                </div>
                <ul className="search-result">
                    {lis}
                </ul>
            </div>
        );
    }
});
