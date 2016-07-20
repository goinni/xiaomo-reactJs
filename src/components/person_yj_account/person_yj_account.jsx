var PersonYijianAccountPageHeader = React.createClass({
    render: function () {
        return (
            <div className="person-yjaccount-page-header">
                <AlinkBack />
                <h1 className="title">账号问题</h1>
            </div>
        );
    }
});
var PersonYijianAccountPageBody = React.createClass({
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
            <div className="yjaccount-us-body">
                <ul className="table-view">
                  <li className="table-view-cell">
                    <span className="navigate-right">
                      1.如何绑定/换绑手机号
                    </span>
                    <div>
                        <p>o 在“个人主页——设置——账号绑定”中可以进行绑定或换绑操作。</p>
                    </div>
                  </li>
                  <li className="table-view-cell">
                    <span className="navigate-right">
                      2.手机收不到验证码怎么办
                    </span>
                    <div>
                        <p>o 收不到验证码是因为进行过短信􏰂订。移动用户发􏰀1111到
                        106901881236661,联通/电信用户发􏰀 1111 带 10690329013666 即可解
                        除􏰂订。 􏰁 怎么修改密码</p>
                        <p>o 在“个人主页——设置——账号绑定”中可以进行设置和修改密码。 􏰁 绑定时提示该手机好已注册</p>
                        <p>o 说明该手机号下已经有其他“小陌优品”账号,一个手机号只能绑定一 个“小陌优品”账号。</p>
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


