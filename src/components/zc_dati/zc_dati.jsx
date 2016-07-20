var ZcDaTiPageHeader = React.createClass({
    render: function () {
        return (
            <div className="zc-dati-page-header">
                <AlinkBack />
                <h1 className="title">健康自测</h1>
            </div>
        );
    }
});
var ZcDaTiPageBody = React.createClass({
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
            ids: appTool.queryUrlParam('ids'),
            bridge: bridge,
            scroll: {},
            list:[]
        }
    },
    componentDidMount: function(){
        var _this = this;
        var xids = this.state.ids.split('-');
        appTool.rmPageLoading();//页面加载完成移出提示

        appTool.sendAjax(Uri.zc_action_mitems,{},function(res){
            var r = [];
            for(var j = 0; j<res.length; j++){
                var en = res[j];
                for(var i = 0; i<xids.length; i++){
                    if(en.id == xids[i]){
                        r.push(en);
                    }
                }
            }
            _this.setState({
                list: r
            });
            
            setTimeout(function(){
                $('.marks-part-area li').click(function(){
                    $(this).toggleClass('active');
                });
                _this.state.scroll.refresh();
            },300);
        },function(err){
            iAlert("获取自测信息失败");
        });

        
        $('#look_zc_result').unbind('click').click(function(){

            var r = [], index = true;
            $('.select-items-box').each(function(){
                var itemId = $(this).attr('name');
                var len = $(this).find('.marks-part-area li.active').size();
                if(!len){
                    // index = false;
                    // iAlert('亲，题未答完~');
                    // return false;
                }else{
                    r.push(itemId+'-'+len);
                }
            });

            if(index){
                var oc_url = "/pages/zc_result/zc_result.html?shengao="+_this.state.shengao+"&tizhong="+_this.state.tizhong+"&selectdata="+r.join(',');
                var iosdata = appTool.setAppData("自测结果", oc_url, "zc_result");
                //IOS通信回调
                appTool.sendAppData(_this.state.bridge, iosdata);
                if(!appTool.hasAppBridge(_this.state.bridge)){
                    appTool.go(oc_url);
                }
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
        var datalist = this.state.list.map(function(o){
            var ms = o.items || [];
            var mklist = ms.map(function(mk){
                return (
                    <li key={mk+Math.random()}>{mk}</li>
                );
            });
            return (
                <div key={o.id} className="select-items-box" name={o.id}>
                    <div className="tip-tex">
                        {o.name}
                        <sub>（请选择符合您情况的标签）</sub>
                        <div>&nbsp;</div>
                    </div>
                    <ul className="marks-part-area">
                        {mklist}
                    </ul>
                </div>
            );
        });
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="zc-dati-body">
                <div className="banner">
                    <img src="/assets/temp_n_10.jpg"/>
                </div>
                {datalist}
                <a id="look_zc_result" className="btn btn-negative btn-block">查看结果</a>
            </div>
</SimplePageScroll>
        );
    }
});


