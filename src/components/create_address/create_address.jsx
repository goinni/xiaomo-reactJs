var CreateAddressPart = React.createClass({
    componentDidMount: function(){
        var ad = this.props.address;
        if(ad && ad.province){
            setTimeout(function(){
                $('#user_addr_sheng').val(ad.province);
                $('#user_addr_shi').val(ad.city);
                $('#user_addr_qu').val(ad.district)
            },1500);
        }
    },
    render: function () {
        var ad = this.props.address;
        var shenlist = this.props.sheng.map(function(o){
            return (
                <option key={o.areaid} value={o.areaid}>{o.areaname}</option>
            );
        });
        var shilist = this.props.shi.map(function(o){
            return (
                <option key={o.areaid} value={o.areaid}>{o.areaname}</option>
            );
        });
        var qulist = this.props.qu.map(function(o){
            return (
                <option key={o.areaid} value={o.areaid}>{o.areaname}</option>
            );
        });
        return (
            <div className="create-address-part">
                <div className="o-row-line">
                    <div className='o-name'>收货人：</div>
                    <div className='o-value'><input id="user_addr_name" defaultValue={ad.name} type="text" placeholder="收货人姓名"/></div>
                </div>
                <div className="o-row-line">
                    <div className='o-name'>联系电话：</div>
                    <div className='o-value'><input id="user_addr_phone" defaultValue={ad.phone} type="text" placeholder="收货人电话"/></div>
                </div>
                <div className="o-row-line">
                    <div className='o-name'>所在省：</div>
                    <div className='o-value'>
                        <select id="user_addr_sheng" defaultValue={ad.province}>
                            {shenlist}
                        </select>
                        <span className="icon icon-right-nav"></span>
                    </div>
                </div>
                <div className="o-row-line">
                    <div className='o-name'>所在市：</div>
                    <div className='o-value'>
                        <select id="user_addr_shi" defaultValue={ad.city}>
                            {shilist}
                        </select>
                        <span className="icon icon-right-nav"></span>
                    </div>
                </div>
                <div className="o-row-line">
                    <div className='o-name'>所在街道：</div>
                    <div className='o-value'>
                        <select id="user_addr_qu" defaultValue={ad.district}>
                            {qulist}
                        </select>
                        <span className="icon icon-right-nav"></span>
                    </div>
                </div>
                <div className="o-row-line">
                    <div className='o-name'>详细地址：</div>
                    <div className='o-value o-detail'><input id="user_addr_detail" defaultValue={ad.detailaddr} type="text" placeholder="如：上地六街数字传媒大厦"/></div>
                </div>
                <div className="o-row-line o-man-id">
                    <div className='o-name'>身份证号码：</div>
                    <div className='o-value'><input id="user_addr_cardID" defaultValue={ad.idcard} type="text" placeholder="证件号码"/></div>
                </div>
                <div className="o-row-line o-save-btn">
                    <button className="btn btn-positive btn-block" onClick={this.props.onsave}>保存地址</button>
                </div>

            </div>
        );
    }
});