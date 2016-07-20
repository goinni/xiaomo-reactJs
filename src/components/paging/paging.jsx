var PullPaging = React.createClass({
    componentDidMount: function(){
        var _this = this,
            myScroll,
            pullDownEl, pullDownOffset,
            pullUpEl, pullUpOffset,
            generatedCount = 0;
        /**
         * 下拉刷新
         * [注]一定要在回调方法[加载完数据后]调用刷新方法 myScroll.refresh();
         */
        function pullDownAction () {
            if(_this.props.onPullDown){
                _this.props.onPullDown.call(this, myScroll);
            }
        }
        /**
         * 上拉加载
         * [注]一定要在回调方法[加载完数据后]调用刷新方法 myScroll.refresh();
         */
        function pullUpAction () {
            if(_this.props.onPullUp){
                _this.props.onPullUp.call(this, myScroll);
            }
        }
        function ionScrollMove(o){
            if(_this.props.onScrollMove){
                _this.props.onScrollMove.call(this, o);
            }
            // 页面无法弹回的原因在于：手指划出屏幕后 touchend 事件无法触发，回弹动画就无法执行。解决办法就是：当手指接近屏幕边缘的时候，手动触发动画方法。
            // 下面解释一下这段代码的意思。
// this.y 是页面已经滚动的垂直距离， this.maxScrollY 是最大垂直滚动距离， this.pointY 手指当前的垂直坐标。
// 当 this.y < this.maxScrollY ，就是已经处于上拉的过程，当 (this.y < this.maxScrollY) && (this.pointY < 1) 时，处于上拉且手指已经触及屏幕边缘，这时候手动触发 this.scrollTo(0, this.maxScrollY, 400) ，页面就开始回弹。
            if((o.y < o.maxScrollY) && (o.pointY < 1)){
                o.scrollTo(0, o.maxScrollY, 400);
                return;
            } else if (o.y > 0 && (o.pointY > window.innerHeight - 1)) {
                o.scrollTo(0, 0, 400);
                return;
            }
        }
        function ionTouchEnd(o){
            if(_this.props.onScrollTouchEnd){
                _this.props.onScrollTouchEnd.call(this, o);
            }
        }
        function loaded() {
            pullDownEl = document.getElementById('pullDown');
            pullDownOffset = pullDownEl.offsetHeight;
            pullUpEl = document.getElementById('pullUp');   
            pullUpOffset = pullUpEl.offsetHeight;
            
            myScroll = new iScroll('page-content-part', {
                useTransition: true,
                // momentum: false,//惯性
                topOffset: pullDownOffset,
                onTouchEnd: function(){
                    ionTouchEnd(this);
                },
                onRefresh: function () {
                    if (pullDownEl.className.match('loading')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                    } else if (pullUpEl.className.match('loading')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载';
                    }
                },
                onScrollMove: function () {
                    ionScrollMove(this);
                    if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'flip';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放加载下一页';
                        this.maxScrollY = this.maxScrollY;
                    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载';
                        this.maxScrollY = pullUpOffset;
                    }
                },
                onScrollEnd: function () {
                    if (pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'loading';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '正在加载...';                
                        pullDownAction();   // Execute custom function (ajax call?)
                    } else if (pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'loading';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载...';                
                        pullUpAction(); // Execute custom function (ajax call?)
                    }
                }
            });
            setTimeout(function () { document.getElementById('page-content-part').style.left = '0'; }, 800);
        }

        // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        loaded();// 在react 方法componentDidMount中页面已经加载完，原理和下面代码一样
        // document.addEventListener('DOMContentLoaded', function () {setTimeout(loaded, 200); }, false);

    },
    render: function(){
        //[注] pullDown class name 初始化必需为 flip !!!
        return (
            <div id="scroller">
                <div id="pullDown" className="flip">
                    <span className="pullDownIcon"></span>
                    <span className="pullDownLabel">Pull down to refresh...</span>
                </div>
                 {
                    React.Children.map(this.props.children, function (child) {
                      return <div>{child}</div>;
                    })
                  }
                <div id="pullUp">
                    <span className="pullUpIcon"></span>
                    <span className="pullUpLabel">上拉加载</span>
                </div>
            </div>
        );
    }
});

