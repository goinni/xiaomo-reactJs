/**
 * 线上环境地址配制文件
 */
 (function(e){
    /**
     * 请求地址仓库
     */
    e.Uri = {
        /**
         * 获取系统参数
         */
        getSystemParam: u('/xiaomo/init_UIParams.do'),
        /**
         * 账号密码 登录
         */
        login_action_pwd: u('/xiaomo/user_UILogin.do'),
        /**
         * 获取短信验证码 done
         */
        get_msg_code: u('/xiaomo/user_UISendVerifycode.do'),
        /**
         * 用户注册
         */
        user_action_register: u('/xiaomo/user_UIReg.do'),
        /**
         * 用户手机号登录
         */
        user_action_mobilelogin: u('/xiaomo/user_UIReg.do'),
        /**
         * 密码修改
         */
        user_action_modify_pwd: u('/xiaomo/user_UIModifyPwd.do'),
        /**
         * 消息通知列表
         */
        notify_msg_list: u('/xiaomo/msg_UIList.do'),
        /**
         * 消息通知总个数
         */
        notify_msg_count: u('/xiaomo/msg_UINotReadCount.do'),
        /**
         * 消息通知 设置为已读
         */
        notify_msg_readed: u('/xiaomo/msg_UISetReadFlag.do'),

        /**
         * 资讯商品列表
         */ 
        news_good_list: u('/xiaomo/info_UIList.do'),
        /**
         * 资讯主页顶部一个大banner
         */
        news_top_banner: u('/tempdata/news_top_banner.json'),
        /**
         * 资讯详情
         */
        news_item_detail: u('/xiaomo/info_UIDetail.do'),
        /**
         * 资讯详情 - 相关产品
         */
        news_detail_tuijian: u('/tempdata/news_detail_tuijian.json'),
        /**
         * 资讯详情 - 猜你喜欢
         */
        news_gust_list: u('/xiaomo/info_UIList.do'),
        /**
         * 资讯详情 - 收藏或取消收藏
         */
        news_my_like: u('/xiaomo/info_UIShouCang.do'),
        /**
         * 资讯详情 - 统计访问量
         */
        news_view_count: u('/xiaomo/info_UIView.do'),
        /**
         * 资讯详情 - 添加评论
         */
        news_add_pinglun: u('/xiaomo/info_UIAddComment.do'),
        /**
         * 资讯 - 用户评论列表
         */
        user_pinglun_list: u('/xiaomo/info_UIInfoCommentList.do'),
        /**
         * 社区问答
         */
        community_qa_list: u('/xiaomo/bbs_UIList.do'),
        /**
         * 社区分享
         */
        community_share_list: u('/xiaomo/bbs_UIList.do'),
        /**
         * 社区分享-图片上传
         */
        community_share_uploadpic: u('/xiaomo/bbs_UIAddPic.do'),
        /**
         * 社区帖子详情(问答或分享)
         */
        community_detail: u('/xiaomo/bbs_UIDetail.do'),
        /**
         * 社区帖子详情(问答或分享)-评论点赞
         */
        community_add_like: u('/xiaomo/bbs_UICommentLike.do'),
        /**
         * 社区帖子（问答或分享） - 累加访问量
         */
        community_view_count: u('/xiaomo/bbs_UIView.do'),
        /**
         * 社区帖子（问答或分享） - 添加评论
         */
        community_add_pinglun: u('/xiaomo/bbs_UIAddComment.do'),
        /**
         * 社区帖子（问答或分享）- 收藏分享
         */
        community_bbs_my_like: u('/xiaomo/bbs_UIShouCang.do'),
        /**
         * 社区帖子（问答或分享）- 发帖子
         */
        community_bbs_add_info: u('/xiaomo/bbs_UIAdd.do'),
        /**
         * 社区帖子（问答或分享）- 更新或删除帖子
         */
        community_bbs_update_info: u('/xiaomo/bbs_UImodify.do'),
        /**
         * 社区帖子（问答或分享）- 添加标签里的标签搜索
         */
        search_mark_list: u('/xiaomo/label_UIListByLagels.do'),

        /**
         * 个人中心 - 用户基础信息
         */
        personal_base_info: u('/xiaomo/user_UIInfo.do'),
        /**
         * 个人中心 - 更新用户基础信息
         */
        personal_base_info_update: u('/xiaomo/user_UIModifyUserById.do'),

        /**
         * 个人中心 - 我的动态
         */
        person_mine_actions: u('/xiaomo/bbs_UIList.do'),
        /**
         * 个人中心 - 删除自己的动态
         */
        // personal_bbs_delitem: u('/tempdata/personal_bbs_delitem.json'),
        /**
         * 个人中心 - 用户收藏 -资讯列表
         */
        person_shouchang_news: u('/xiaomo/userCol_UIList.do'),
        /**
         * 个人中心 - 用户收藏 -商品列表
         */
        person_shouchang_goods: u('/xiaomo/userCol_UIList.do'),
        /**
         * 个人中心 - 用户收藏 -帖子列表
         */
        person_shouchang_bbs: u('/xiaomo/userCol_UIList.do'),
        /**
         * 个人中心 - 用户设置-上传头像
         */
        person_uploadFace: u('/xiaomo/user_UIUploadFaceImg.do'),
        /**
         * 个人中心 - 更新用户标签信息
         */
        person_upload_userlabels: u('/xiaomo/user_UIModifyLabelsByUserId.do'),
        /**
         * 首页banner
         */
        home_banner: u('/xiaomo/banner_UIList.do'),
        /**
         * 首页标签
         */
        home_marks: u('/tempdata/home_marks.json'),
        /**
         * 首页商品列表
         */ 
        home_good_list: u('/xiaomo/vmgoods_UIList.do'),
        /**
         * 首页-商品列表 支持标签过滤 非标签商品在后
         */ 
        home_good_list_bylables: u('/xiaomo/vmgoods_UIListForLabel.do'),
        /**
         * 首页-热门商品列表
         */ 
        home_hot_good_list: u('/xiaomo/vmgoods_UIHotRecommendList.do'),
        /**
         * 首页商品详情
         */
        home_good_detail: u('/xiaomo/vmgoods_UIDetail.do'),
        /**
         * 商品 评论列表
         */
        good_pinglun_list: u('/xiaomo/vmgoods_UIProdCommentList.do'),
        /**
         * 服务商品 评论列表
         */
        servergood_pinglun_list: u('/xiaomo/vmgoods_UIServCommentList.do'),
        /**
         * 保险商品 评论列表
         */
        insugood_pinglun_list: u('/xiaomo/vmgoods_UIInsuCommentList.do'),
        /**
         * 商品 添加评论
         */
        good_add_pinglun: u('/xiaomo/vmgoods_UIAddComment.do'),
        /**
         * 商品 收藏 
         */
        good_shouchang: u('/xiaomo/vmgoods_UIShouCang.do'),
        /**
         * 商品 浏览量统计
         */
        good_count_view: u('/xiaomo/vmgoods_UIView.do'),
        /**
         * 购物车 - 添加商品到购物车
         */
        buycar_add_goods: u('/xiaomo/cart_UIAddItemToCart.do'),
        /**
         * 购物车 - 修改购物车商品
         */
        buycar_edit_goods: u('/xiaomo/cart_UIModifyBuyQtyById.do'),
        /**
         * 购物车 - 获取购物车商品列表
         */
        buycar_goods_list: u('/xiaomo/cart_UIList.do'),
        /**
         * 购物车 - 删除购物车一个商品
         */
        buycar_del_goods: u('/xiaomo/cart_UIDelItemFromCartById.do'),
        /**
         * 用户收货地址列表
         */
        user_address_list: u('/xiaomo/address_UIListByUserId.do'),
        /**
         * 创建用户收货地址
         */
        user_address_create: u('/xiaomo/address_UIAdd.do'),
        /**
         * 编辑用户收货地址
         */
        user_address_edit: u('/xiaomo/address_UIModifyById.do'),
        /**
         * 删除用户收货地址
         */
        user_address_delete: u('/xiaomo/address_UIDelById.do'),
        /**
         * 订单-创建
         */
        order_action_create: u('/xiaomo/order_UICreateOrderFromCart.do'),
        /**
         * 订单-详情信息
         */
        order_action_info: u('/xiaomo/order_UIDetailByParentId.do'),
        /**
         * 订单-我的订单列表
         */
        order_action_mylist: u('/xiaomo/order_UIListByUserId.do'),
        /**
         * 订单-根据父订单号取消订单
         */
        order_action_cancel: u('/xiaomo/order_UICancelOrderByParentId.do'),
        /**
         * 搜索-热门标签
         */
        search_hot_marks: u('/xiaomo/label_UIList.do'),
        /**
         * 商品详情-猜你喜欢-列表数据
         */
        gust_like_data: u('/xiaomo/vmgoods_UIGuessYouLikeVMGoodsList.do'),
        /**
         * 获取地址：省，数据列表
         */
        address_lev_sheng: u('/xiaomo/area_UIProvinceList.do'),
        /**
         * 获取地址：市，数据列表
         */
        address_lev_shi: u('/xiaomo/area_UICityListByProvinceId.do'),
        /**
         * 获取地址：区，数据列表
         */
        address_lev_qu: u('/xiaomo/area_UIDistrictListByCityId.do'),
        /**
         * 自测请求数据
         */
        zc_action_mitems: u('/tempdata/zc_action_mitems.json'),
        /**
         * 社区里的评论详情
         */
        pinglun_action_itemdetail: u('/xiaomo/bbs_UICommentDetail.do'),
        /**
         * 标签访问记录
         */
        mark_add_view_record: u('/xiaomo/label_UIClick.do'),
        
















        
        
        
        /**
         * 资讯banner
         */ 
        news_banner: u('/tempdata/news_banners.json'),
        
        /**
         * 商品搜索请求
         */ 
        search_goods: u('/tempdata/nav_search_result.json'),
        /**
         * 商品搜索出的商品详情
         */
        search_good_detail: u(''),
        /**
         * 商品列表
         */
        good_action_list: u('/tempdata/good_list.json'),
        
        /**
         * 商品详情-标签列表数据
         */
        news_detail_marks: u('/tempdata/news_detail_marks.json')
    };

    /**
     * 构造请求地址
     */
    function u(path){
        // var frontaddr = "http://114.215.154.56";
        var frontaddr = "";
        return frontaddr+path;
    }
 })(window);