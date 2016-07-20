var PersonYijianJianyiPageHeader = React.createClass({
    render: function () {
        return (
            <div className="person-yjjianyi-page-header">
                <AlinkBack />
                <h1 className="title">功能建议</h1>
            </div>
        );
    }
});
var PersonYijianJianyiPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    render: function () {
        return (
            <div className="yjjianyi-us-body">
            􏰁    <h5>敬请致电: 010 - 5869 9022</h5>
                <h5>&nbsp;</h5>
            </div>

        );
    }
});


