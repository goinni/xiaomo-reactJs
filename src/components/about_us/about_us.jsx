var AboutUsPageHeader = React.createClass({
    render: function () {
        return (
            <div className="about-us-page-header">
                <AlinkBack />
                <h1 className="title">关于小陌</h1>
            </div>
        );
    }
});
var AboutUsPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        //如果内容少，则设置内容高度为屏幕高度
        appTool.setElemWithScreenHeight('.about-us-body',1); 
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="about-us-body">
                    
            </div>

        );
    }
});


