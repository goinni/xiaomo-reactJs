var KefuPageHeader = React.createClass({
    render: function () {
        return (
            <div className="kefu-page-header">
                <AlinkBack />
                <h1 className="title">客服</h1>
            </div>
        );
    }
});
var KefuPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.kefu-body',1); 
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    pagescrollload:function(scroll){
        setTimeout(function(){
            scroll.refresh();
        },500);
    },
    render: function () {
        return (
            <SimplePageScroll onload={this.pagescrollload} bounce={false}>
            <div className="kefu-body">
                <br/><br/><br/>
            </div>
            </SimplePageScroll>
        );
    }
});


