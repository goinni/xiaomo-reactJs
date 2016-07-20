var AlinkBack = React.createClass({
    historyback: function(e){
        $(e.target).attr('href', appTool.pullHistoryLink());
    },
    render: function(){
        return (
            <a onTouchStart={this.historyback} data-transition="slide-out" className="icon icon-left-nav pull-left"></a>
        );
    }
});

