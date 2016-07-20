var YaoqingPageHeader = React.createClass({
    render: function () {
        return (
            <div className="yaoqing-page-header">
                <AlinkBack />
                <h1 className="title">邀请好友</h1>
            </div>
        );
    }
});
var YaoqingPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="yaoqing-body">
                <img className="temp-img" src="/assets/yq_03.jpg"/>
            </div>

        );
    }
});


