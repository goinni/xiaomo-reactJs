var HorizontalScroll = React.createClass({
    getInitialState: function(){
        return {
            id: this.props.id,
            width: this.props.width || '36rem'
        }
    },
    componentDidMount: function(){
        $('#'+this.state.id+' .scroller').css('width',this.state.width);//设置横滚内容宽度
        new iScroll(this.state.id, { scrollX: true, scrollY: false, mouseWheel: false });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    },
    render: function(){
        //[注] 必需设置Id,且context中不重复
        return (
            <div className="horizontal_wrapper" id={this.state.id}>
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

