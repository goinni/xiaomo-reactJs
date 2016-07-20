var PayOverPageHeader = React.createClass({
    render: function () {
        return (
            <div className="payover-page-header">
                    <AlinkBack />
                    <h1 className="title">支付完成</h1>
            </div>
        );
    }
});
var PayOverPageBody = React.createClass({
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
            bridge: bridge,
            ordernum: appTool.queryUrlParam('ordernum')
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        var url = "/pages/order_detail/order_detail.html?ordernum="+this.state.ordernum;
        var linkdata = appTool.setAppData("订单详情", url, "order_detail");
        return (
            <div className="payover-body">
                <img src="/assets/pover_icon.png"/>
                <Alink className="look-order-detail" href={url} data={linkdata} bridge={this.state.bridge}>查看订单</Alink>
            </div>
        );
    }
});


