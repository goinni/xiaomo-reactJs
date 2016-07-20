var LoginPasswordPageHeader = React.createClass({
    componentDidMount:function(){
        $('.login-history-back').attr('href','/pages/home/home.html');
    },
    historyBack: function(){

    },
    render: function () {
        return (
            <div className="login-page-header">
                <AlinkBack />
                <h1 className="title">密码</h1>
            </div>
        );
    }
});
var LoginPasswordPageBody = React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        appTool.rmPageLoading();//页面加载完成移出提示
    },
    onChangePwd: function(e){
        var code = appTool.queryUrlParam('code');//验证码
        var mobile = appTool.queryUrlParam('mobile');//手机号
        var pwd= $('.pwd-code').val();//密码
        var temppwd = $('.pwd-code1').val();
        var tart_a = e.target;
        if(!pwd || !temppwd){
            iAlert('密码不能为空');
            return false;
        }
        if(pwd != temppwd){
            iAlert('两次密码不一直');
            return false;
        }
        //修改密码
        appTool.sendAjax(Uri.user_action_modify_pwd, {
            "user.phonenum": mobile,
            "user.verifyCode": code,
            "user.password": pwd
        }, function(d){
            //修改成功去登录页面
            appTool.go("/pages/login/login.html");
        }, function(errmsg){
            iAlert(errmsg);
        });
    },
    render: function () {
        return (
            <div className="input-group login-page-body">
              <div className="input-row">
                <label>请输入密码</label>
                <input className="pwd-code1" type="text" placeholder="请输入密码"/>
              </div>
              <div className="input-row">
                <label>确认密码</label>
                <input className="pwd-code" type="password" placeholder="确认密码"/>
              </div>
              <a href="#" onClick={this.onChangePwd} className="btn btn-positive btn-block">确认</a>
            </div>
        );
    }
});


