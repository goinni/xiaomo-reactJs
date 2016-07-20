var SlideDeleteBox = React.createClass({
    componentDidMount: function(){
        var startPosition, endPosition, deltaX, deltaY, moveLength;
        var delBoxWidth = 4;//删除按钮盒子的宽度 
        var unit = 'rem'; //盒子单位

        var tempStartTime = 0;//滑动开始
        var tempEndTime = 0;//滑动结束
        $('.slide-delete-block').bind('touchstart', function(e){
            // e.preventDefault();
            var touch = e.touches&&e.touches[0] || e.originalEvent.touches[0];
            startPosition = {
                x: touch.pageX,
                y: touch.pageY
            }
            tempStartTime = new Date().getTime();//赋值开始时间
        }).bind('touchmove', function(e){
            tempEndTime = new Date().getTime();//赋值结束时间
            if((tempEndTime - tempStartTime)<50){
                //滑动开始到结束在50毫秒内不做处理
                return true;
            }
            // e.preventDefault();
            var touch = e.touches&&e.touches[0] || e.originalEvent.touches[0];
            endPosition = {
                x: touch.pageX,
                y: touch.pageY
            }

            deltaX = endPosition.x - startPosition.x;
            deltaY = endPosition.y - startPosition.y;

            //删除是水平滑动，所以要限制垂直滑动事件
            //垂直滑动大于8则不触发水平滑动
            if(Math.abs(deltaY)>8){
                return true;
            }
            //移动的距离
            moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
            // console.log(deltaX,deltaY,moveLength);
            var x = moveLength / 16; //像素转rem
            var dex = 0;
            var tmpLeft = parseFloat(this.style.left);
            if(deltaX<0){
                //向左滑
                if(x>=delBoxWidth || x>delBoxWidth/2){
                    //大于一半或大于删除区域宽度时全部显示删除按钮
                    x = delBoxWidth;
                    dex = null;
                }else if (x<delBoxWidth/2){
                    //向左滑动小于一半时位置保持不变
                    dex = 0;
                }
                if(tmpLeft!=-delBoxWidth){
                    //已经打开的不处理
                    moveLength = '-'+ x + unit;
                }
            }else{
                //向右滑
                if(tmpLeft>=0 || x>delBoxWidth/2){
                    x = 0;
                    dex = 0;
                }else if (x<delBoxWidth/2){
                    //向右滑动距离小于一半时保持不变
                    dex = -delBoxWidth;
                }
                moveLength = x +unit; 
            }
            this.style.left = moveLength;
            //滑动结束时处理位置
            this._delbox_where_index = dex;

        }).bind('touchend', function(e){
            var touch = e.touches&&e.touches[0] || e.originalEvent.touches[0], xw = this._delbox_where_index;
            if(xw != null){
                this.style.left = xw + unit;
            }
        });
    },
    render: function(){
        //[注] 调用组件的父节点一定要是相对定位
        return (
            <div className='slide-delete-block'>
                <div className="sd-content">
                    {
                        React.Children.map(this.props.children, function (child) {
                          return <div>{child}</div>;
                        })
                    }
                </div>
                <div className="sd-button icon icon-trash" onTouchEnd={this.props.ondelete}></div>
            </div>
        );
    }
});

