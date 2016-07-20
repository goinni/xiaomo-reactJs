var SearchHotMarksPageHeader = React.createClass({
    componentDidMount:function(){
        appTool.rmPageLoading();//页面加载完成移出提示
        $('.search-hotmarks-page-header').parent().hide();
        $('#page-content-part').css('paddingTop','0');
    },
    render: function () {
        return (
            <div className="search-hotmarks-page-header">
            </div>
        );
    }
});

var SearchHotMarksPageBody = React.createClass({
    getInitialState: function(){
        return {
            bridge:{},
            searchMarklist:[]
        };
    },
    componentDidMount: function(){
        var _this =this;
        /**
         * 初始化 webview 通信管道
         */
        appTool.installWebview(function(event){
            //设置好通信对象，方便调用
            _this.setState({
                bridge: event.bridge
            });
        });
        /**
         * 获取热门标签
         */
        appTool.sendAjax(Uri.search_hot_marks,{
            "label.hotflag": 1,
            "label.delflag": 0
        },function(res){
            _this.setState({
                searchMarklist: res
            });
        },function(err){
            iAlert("search-result loaded error");
        });
    },
    render: function () {
        var _this = this;
        var list = this.state.searchMarklist.map(function(o){
            var linkdata = {
                    title: o.name,
                    url: '/pages/news_list/news_list.html', 
                    type: 'hotmarks'
                };
            return (
                <li key={o.labeid}>
                    <Alink href="/pages/news_list/news_list.html" data={linkdata} bridge={_this.state.bridge}>{o.name}</Alink>
                </li>
            );
        });
        return (
            <div className="search-hotmarks-part">
                <div className="hot-key-place">
                  <p>热门标签</p>
                  <ol>
                        {list}
                  </ol>
                </div>
            </div>
        );
    }
});

