var SwiperComponent = React.createClass({
    componentDidMount: function(){
        var _this = this;
        var autotime = this.props.autotime || 2500;//自动播放时间
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: autotime,
            autoplayDisableOnInteraction: false,
            onClick: function(swiper){
                if(_this.props.onClick){
                    _this.props.onClick(swiper);
                }
            }
        });
    },
    render: function () {
        var _this = this;
            var banners = this.props.banners.map(function(banner){
                var imgUrl = _this.props.path.prefix_pic_thumbnail+'/'+banner.imgurl;//构造图片地址
                return (
                    <div key={banner.id} className="swiper-slide" data-title={banner.title} data-href={banner.linkurl}>
                        <img src={imgUrl}/>
                    </div>
                );
            });    
        
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {banners}
                </div>
                <div className="swiper-pagination"></div>
            </div>
        );
    }
});
