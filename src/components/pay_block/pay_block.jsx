var PayBlockPart = React.createClass({
    componentDidMount: function(){
        //支付选择切换
        $('.pay-btn .toggle').click(function(){
            var name = $(this).attr('name');
            var isactive = $(this).hasClass('active');
            if(name === "weixin"){
                if(isactive){
                    wopen();
                    zfclosed();
                }else{
                    wclosed();
                    zfopen();
                }
                
            }else{
                if(isactive){
                    zfopen();
                    wclosed();
                }else{
                    zfclosed();
                    wopen();
                }
            }
            function wopen(){
                $('.pay-btn').find('div[name="weixin"]').addClass('active');
                $('.pay-btn').find('div[name="weixin"] div').css('transform','translate3d(17px, 0px, 0px)');
            }
            function wclosed(){
                $('.pay-btn').find('div[name="weixin"]').removeClass('active');
                $('.pay-btn').find('div[name="weixin"] div').css('transform','translate3d(0px, 0px, 0px)');
            }
            function zfopen(){
                $('.pay-btn').find('div[name="zhifubao"]').addClass('active');
                $('.pay-btn').find('div[name="zhifubao"] div').css('transform','translate3d(17px, 0px, 0px)');
            }
            function zfclosed(){
                $('.pay-btn').find('div[name="zhifubao"]').removeClass('active');
                $('.pay-btn').find('div[name="zhifubao"] div').css('transform','translate3d(0px, 0px, 0px)');
            }
        });
    },
    render: function () {
        return (
            <div className="pay-block-part">
                <dl className='pay-block-area'>
                    <dt>支付方式</dt>
                    <dd>
                        <div className='pay-logo'><img src="/assets/icon_zfb.png"/></div>
                        <div className='pay-name'>支付宝支付</div>
                        <div className='pay-btn'>
                            <div className="toggle active" name="zhifubao">
                              <div className="toggle-handle"></div>
                            </div>
                        </div>
                    </dd>
                    <dd>
                        <div className='pay-logo'><img src="/assets/icon_weixin.png"/></div>
                        <div className='pay-name'>微信支付</div>
                        <div className='pay-btn'>
                            <div className="toggle" name="weixin">
                              <div className="toggle-handle"></div>
                            </div>
                        </div>
                    </dd>
                </dl>
                <div className="o-row-line o-save-btn2">
                    <button onClick={this.props.onchanel} className="btn btn-positive btn-block">取消订单</button>
                </div>
            </div>
        );
    }
});
