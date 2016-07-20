var ZcChoosedMarksPageHeader = React.createClass({
    render: function () {
        return (
            <div className="zc-choosedmarks-page-header">
                <AlinkBack />
                <h1 className="title">健康自测</h1>
            </div>
        );
    }
});
var ZcChoosedMarksPageBody = React.createClass({
    getInitialState: function(){
        var _this = this, bridge;
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
            tizhong: appTool.queryUrlParam('tizhong'),
            shengao: appTool.queryUrlParam('shengao'),
            usersex: appTool.queryUrlParam('usersex'),
            bridge: bridge,
            scroll: {},
            list:[]
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        //获取 题目标签
        appTool.sendAjax(Uri.zc_action_mitems,{},function(res){
            _this.setState({
                list: res
            });
            $('.marks-part-area li').click(function(){
                var n = $('.marks-part-area li.active').size();
                if(n>=4 && !$(this).hasClass('active')){
                    iAlert('亲，最多选择4个~');
                    return ;
                }
                $(this).toggleClass('active');
            });
            setTimeout(function(){
                _this.state.scroll.refresh();
            },300);
        },function(err){
            iAlert("获取自测信息失败");
        });

        //下一步
        $('#look_zc_dati_result').click(function(){
            var ids = [];
            $('.marks-part-area li.active').each(function(){
                var xi = $(this).attr('name');
                ids.push(xi);
            });
            if(!ids.length){
                iAlert('亲，至少选择一个~');
                return ;
            }
            var oc_url = "/pages/zc_dati/zc_dati.html?shengao="+_this.state.shengao+"&tizhong="+_this.state.tizhong+"&ids="+ids.join('-');
            var iosdata = appTool.setAppData("健康测试", oc_url, "zc_dati");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    render: function () {
        var isMan = this.state.usersex;
        var mklist = this.state.list.map(function(o){
            if((isMan == '1' && o.id == '13') || (isMan == '2' && o.id == '14')){
                return null; 
            }
            return (
                <li name={o.id} key={o.id}>{o.name}</li>
            );
        });
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="zc-choosedmarks-body">
                <div className="banner">
                    <img src="/assets/temp_n_10.jpg"/>
                </div>
                <div className="tip-tex">
                    选择检测类别<font>（最少1个，最多4个）</font>
                </div>
                <ul className="marks-part-area">
                    {mklist}
                </ul>
                <a id="look_zc_dati_result" className="btn btn-negative btn-block">下一步</a>
            </div>
</SimplePageScroll>
        );
    }
});


