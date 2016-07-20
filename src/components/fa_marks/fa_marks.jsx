var FaMarksPageHeader = React.createClass({
    topChanle: function(e){
        $(e.target).attr('href', appTool.pullHistoryLink());
    },
    render: function () {
        return (
            <div className="fa-marks-page-header">
                <a onTouchStart={this.topChanle} href="#" data-transition="slide-out" className="btn btn-link pull-right">取消</a>
                <h1 className="title">
                    添加标签
                </h1>
            </div>
        );
    }
});
var FaMarksPageBody = React.createClass({
    getInitialState: function(){
        var labels = appTool.localGet('_user_fa_labels') || "";
        return {
            bbstype: appTool.queryUrlParam('bbstype'), //页面类型,发问2，发贴1
            labels: labels.split(',')
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    addSMark: function(mk){
        var tmpmk = appTool.localGet('_user_fa_labels') || [];
        if(tmpmk.length){
            tmpmk = tmpmk.split(',');
        }
        if(tmpmk.indexOf(mk)==-1){
            //不包含则添加
            tmpmk.push(mk);
        }
        appTool.localSet('_user_fa_labels',tmpmk.join(','));
    },
    onAddEv: function(){
        var intext = $('.nav-mark-input').val();
        if(!intext){
            iAlert('标签名不能为空');
            return ;
        }
        this.addSMark(intext);
        //返回到之前的页面
        this.gobackpage();
        // $('.add-btn-place').attr('href', appTool.pullHistoryLink());
    },
    gobackpage: function(){
        var _this = this;
        var oc_url = "";
        var iosdata = "";
        if(this.state.bbstype == 1){
            //发贴
            oc_url = "/pages/fa_tei/fa_tei.html?sortid=2";
            iosdata = appTool.setAppData("发帖", oc_url, "publish");
        }else{
            //发问
            oc_url = "/pages/fa_wen/fa_wen.html?sortid=1";
            iosdata = appTool.setAppData("发问", oc_url, "publish");
        }
        //IOS通信回调
        appTool.sendAppData(_this.state.bridge, iosdata);
        if(!appTool.hasAppBridge(_this.state.bridge)){
            appTool.go(oc_url);
        }
    },
    onSelectedEv: function(e){
        var elem = e.target;
        var intext = $(elem).html();
        this.addSMark(intext);
        //返回到之前的页面
        this.gobackpage();
        // $(elem).attr('href', appTool.pullHistoryLink());
    },
    render: function () {
        var _this = this;
        var labels = this.state.labels.map(function(o){
            return (
                <li key={Math.random()}><a data-transition="slide-out" onTouchStart={_this.onSelectedEv}>{o}</a></li>
            );
        });
        return (
            <div className="fa-marks-body">
                    <div className="fa-marks-page-header">
                            <input className="nav-mark-input" type="search" placeholder="请输入标签名"/>
                    </div>
                    <a data-transition="slide-out" onTouchStart={this.onAddEv} href="#" className="add-btn-place">
                        <div className="img-icon">+</div>
                        <div className="tip">点击添加</div>
                    </a>
                    <ul className="mark-list">
                        {labels}
                    </ul>
            </div>

        );
    }
});


