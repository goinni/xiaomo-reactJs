var Alink = React.createClass({
    getInitialState: function(){
        return {
            bridge: this.props.bridge,
            data: this.props.data,
            transition: this.props.transition || 'slide-in'
        }
    },
    aEv:function(e){
        // e.preventDefault();
        var _this = this;
        //IOS通信回调
        if(_this.state.bridge && _this.state.bridge.callHandler){
            _this.state.bridge.callHandler('webviewCallback', this.state.data, function(response) {
                    _this.props.callback && _this.props.callback(response);
            });
        }
        //若有事件则一起执行
        _this.props.onTouch && _this.props.onTouch();
    },
    render: function(){
        return (
            <a onClick={this.aEv} href={this.props.href} className={this.props.className}  data-transition={this.state.transition}>
                {
                    React.Children.map(this.props.children, function (child) {
                      return <font>{child}</font>;
                    })
                }
            </a>
        );
    }
});

