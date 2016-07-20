var SimplePageScroll = React.createClass({
    getInitialState: function(){
        return {
            bounce: typeof this.props.bounce === 'boolean'? this.props.bounce : true,
            id: this.props.id || 'simplePageScrollId',
            myscroll: {}
        }
    },
    componentDidMount: function(){
        var _this = this;
        this.state.myscroll = new iScroll(this.state.id,{
            onBeforeScrollStart:function(e){
                var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
                if(nodeType != 'select' && nodeType != 'option' && nodeType != 'input' && nodeType != 'textarea'){
                    e.preventDefault();
                }
            },
            onScrollMove: function(){
                // console.log(this.y );
                _this.props.onScrollMove && _this.props.onScrollMove(this);
            },
            onScrollEnd: function(){
                // console.log(this.y,"------>");
                _this.props.onScrollEnd && _this.props.onScrollEnd(this);
            },
            // momentum: false,
            bounce: _this.state.bounce //超出实际位置不反弹
        });
        // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if(this.props.onload){
            setTimeout(function(){
                _this.props.onload(_this.state.myscroll);
            },100);
        }
    },
    render: function(){
        //[注] 设置Id时在context中不能重复
        return (
            <div className="simple-scroller-wrapper" id={this.state.id}>
                <div className="scroller">
                    {
                        React.Children.map(this.props.children, function (child) {
                          return <div>{child}</div>;
                        })
                    }
                </div>
            </div>
        );
    }
});

