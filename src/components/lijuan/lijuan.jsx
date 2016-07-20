var LijuanPageHeader = React.createClass({
    render: function () {
        return (
            <div className="lijuan-page-header">
                <AlinkBack />
                <h1 className="title">礼券</h1>
            </div>
        );
    }
});
var LijuanPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="lijuan-body">
                <img className="temp-img" src="/assets/lijuantmp.png"/>
                <img className="temp-img" src="/assets/lijuantmp.png"/>
                <img className="temp-img" src="/assets/lijuantmp.png"/>
            </div>

        );
    }
});


