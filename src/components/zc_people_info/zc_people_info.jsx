var ZcPeopleInfoPageHeader = React.createClass({
    render: function () {
        return (
            <div className="zc-peopleinfo-page-header">
                <AlinkBack />
                <h1 className="title">提交身体信息</h1>
            </div>
        );
    }
});
var ZcPeopleInfoPageBody = React.createClass({
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
            bridge: bridge,
            scroll: {},
            list:[]
        }
    },
    componentDidMount: function(){
        var _this = this;
        appTool.rmPageLoading();//页面加载完成移出提示
        //构造年龄列表
        for(var i = 20; i<71; i++){
            $('.old-list').append('<option>'+i+'</option>');
        }
        //构造身高列表
        for(var i = 150; i<200; i++){
            $('.cm-list').append('<option>'+i+'CM</option>');
        }
        //构造体重列表
        for(var i = 40; i<150; i++){
            $('.kg-list').append('<option>'+i+'KG</option>');
        }
        //身体信息选择
        $('.table-view-cell select').change(function(){
            $(this).parent().find('.badge').html($(this).val());
        });
        // 下一步
        $('#next_step_zc_info').click(function(){
            var tizhong = $('#tizhong').val();
            var shengao = $('#shengao').val();
            var usersex = $('#user_sex').val()=='男'?1:2;
            var uname = $('.p-user-name').val();
            if(!uname){
                iAlert('姓名不能为空');
                return ;
            }
            if(!tizhong){
                iAlert('体重不能为空');
                return ;
            }
            if(!shengao){
                iAlert('身高不能为空');
                return ;
            }
            if(!usersex){
                iAlert('性别不能为空');
                return ;
            }

            var oc_url = "/pages/zc_choosed_marks/zc_choosed_marks.html?usersex="+usersex+"&tizhong="+tizhong+"&shengao="+shengao;
            var iosdata = appTool.setAppData("健康测试", oc_url, "zc_choosed_marks");
            //IOS通信回调
            appTool.sendAppData(_this.state.bridge, iosdata);
            if(!appTool.hasAppBridge(_this.state.bridge)){
                appTool.go(oc_url);
            }
        });
        setTimeout(function(){
            _this.state.scroll.refresh();
        },300);
    },
    pagescrollload:function(scroll){
        this.setState({
            scroll: scroll
        });
        scroll.refresh();
    },
    render: function () {
        return (
<SimplePageScroll onload={this.pagescrollload}>
            <div className="zc-peopleinfo-body">
                <div className="banner">
                    <img src="/assets/temp_n_03.jpg"/>
                </div>
                <ul className="table-view">
                      <li className="table-view-cell">
                        <div className="navigate-right">
                          名称:
                           <input className="p-user-name" type="text" placeholder="请输入您的姓名"/>
                        </div>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">20</span>
                          年龄
                        </a>
                        <select className="old-list">
                        </select>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">男</span>
                          性别
                        </a>
                        <select id="user_sex">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">150CM</span>
                          身高
                        </a>
                        <select id="shengao" className='cm-list'>
                        </select>
                      </li>
                      <li className="table-view-cell">
                        <a className="navigate-right">
                          <span className="badge">40KG</span>
                          体重
                        </a>
                        <select id="tizhong" className='kg-list'>
                        </select>
                      </li>
                </ul>
                <button id="next_step_zc_info" className="btn btn-negative btn-block">下一步</button>
            </div>
</SimplePageScroll>
        );
    }
});


