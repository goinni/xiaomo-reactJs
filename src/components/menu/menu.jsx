var FooterMenuBar = React.createClass({
    getInitialState: function(){
        return {
        };
    },
    componentDidMount: function(){
    },
    render: function () {
        return (
            <div className="footer-place-part">
                <a className="tab-item" href="/pages/home/home.html" data-transition="slide-in">
                    <span className="icon icon-home"></span>
                    <span className="tab-label">商城</span>
                </a>
                <a className="tab-item" href="/pages/news/news.html" data-transition="slide-in">
                    <span className="icon icon-list"></span>
                    <span className="tab-label">资讯</span>
                </a>
                <a className="tab-item" href="#" data-transition="slide-in">
                    <span className="icon icon-star-filled"></span>
                    <span className="tab-label">社区</span>
                </a>
                <a className="tab-item" href="#" data-transition="slide-in">
                    <span className="icon icon-person"></span>
                    <span className="tab-label">个人</span>
                </a>
          </div>
        );
    }
});
