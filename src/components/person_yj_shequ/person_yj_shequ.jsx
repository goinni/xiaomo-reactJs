var PersonYijianShequPageHeader = React.createClass({
    render: function () {
        return (
            <div className="person-yjshequ-page-header">
                <AlinkBack />
                <h1 className="title">社区问题</h1>
            </div>
        );
    }
});
var PersonYijianShequPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
        $('.table-view li').click(function(){
            $(this).find('div').toggle();
            $(this).toggleClass('active');
        });
    },
    render: function () {
        return (
            <div className="yjshequ-us-body">
                <ul className="table-view">
                  <li className="table-view-cell">
                    <span className="navigate-right">
                      1.为什么我发的分享没有立即显示在标签下
                    </span>
                    <div>
                        <p>o 笔记通过审核后会在标签下显示出来的喔。</p>
                    </div>
                  </li>
                  <li className="table-view-cell">
                    <span className="navigate-right">
                      2.点赞会增加积分吗?
                    </span>
                    <div>
                        <p>o 每天积分增加上限为2000分(每次点赞积2分)做任务得到的奖励在哪里,怎么用</p>
                        <p>o 做人的得到的“现金券”在“个人——礼券”,可在购物时结算进行抵 用。</p>
                    </div>
                  </li>
                  <li className="table-view-cell">
                    <span className="navigate-right">
                      3.其他问题
                    </span>
                    <div>
                        <p>o 敬请致电:010-58699022</p>
                    </div>
                  </li>
                </ul>
            </div>

        );
    }
});


