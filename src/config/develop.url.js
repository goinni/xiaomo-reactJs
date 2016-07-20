/**
 * 开发环境地址配制文件
 */
 (function(e){
    /**
     * 请求地址仓库
     */
    e.Uri = {
        /**
         * 获取系统参数
         */
        getSystemParam: u('/tempdata/getSystemParam.json'),
        /**
         * 账号密码 登录
         */
        login_action_pwd: u('/tempdata/login_pwd.json'),
        /**
         * 获取短信验证码
         */
        get_msg_code: u('/tempdata/get_msg_code.json'),
        /**
         * 用户注册
         */
        user_action_register: u('/tempdata/user_action_register.json'),
        /**
         * 用户手机号登录
         */
        user_action_mobilelogin: u('/tempdata/user_action_mobilelogin.json'),
        /**
         * 密码修改
         */
        user_action_modify_pwd: u('/tempdata/user_action_modify_pwd.json'),
        /**
         * 消息通知列表
         */
        notify_msg_list: u('/tempdata/notify_msg_list.json'),
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
        news_good_list: u('/tempdata/news_list.json'),
        /**
         * 资讯主页顶部一个大banner
         */
        news_top_banner: u('/tempdata/news_top_banner.json'),
        /**
         * 资讯详情
         */
        news_item_detail: u('/tempdata/news_item_detail.json'),
        /**
         * 资讯详情 - 相关产品
         */
        news_detail_tuijian: u('/tempdata/news_detail_tuijian.json'),
        /**
         * 资讯详情 - 猜你喜欢
         */
        news_gust_list:u('/tempdata/news_gust_list.json'),
        /**
         * 资讯详情 - 点赞
         */
        news_my_like: u('/tempdata/news_my_like.json'),
        /**
         * 资讯详情 - 统计访问量
         */
        news_view_count: u('/tempdata/news_view_count.json'),
        /**
         * 资讯详情 - 添加评论
         */
        news_add_pinglun: u('/tempdata/news_add_pinglun.json'),
        /**
         * 资讯 - 用户评论列表 
         */
        user_pinglun_list: u('/tempdata/user_pinglun_list.json'),
        /**
         * 社区问答
         */
        community_qa_list: u('/tempdata/community_qa_list.json'),
        /**
         * 社区分享
         */
        community_share_list: u('/tempdata/community_share_list.json'),
        /**
         * 社区分享-图片上传
         */
        community_share_uploadpic: u('/xiaomo/bbs_UIAddPic.do'),
        /**
         * 社区帖子详情(问答或分享)
         */
        community_detail: u('/tempdata/community_detail.json'),
        /**
         * 社区帖子详情(问答或分享)-点赞
         */
        community_add_like: u('/tempdata/community_add_like.json'),
        /**
         * 社区帖子（问答或分享） - 累加访问量
         */
        community_view_count: u('/tempdata/community_view_count.json'),
        /**
         * 社区帖子（问答或分享） - 添加评论
         */
        community_add_pinglun: u('/tempdata/community_add_pinglun.json'),
        /**
         * 社区帖子（问答或分享）- 收藏分享
         */
        community_bbs_my_like: u('/tempdata/community_bbs_my_like.json'),
        /**
         * 社区帖子（问答或分享）- 发帖子
         */
        community_bbs_add_info: u('/tempdata/community_bbs_add_info.json'),
        /**
         * 社区帖子（问答或分享）- 更新或删除帖子
         */
        community_bbs_update_info: u('/xiaomo/bbs_UImodify.do'),
        /**
         * 社区帖子（问答或分享）- 添加标签里的标签搜索
         */
        search_mark_list: u('/tempdata/search_mark_list.json'),
        /**
         * 个人中心 - 用户基础信息
         */
        personal_base_info: u('/tempdata/personal_base_info.json'),
        /**
         * 个人中心 - 更新用户基础信息
         */
        personal_base_info_update: u('/xiaomo/user_UIModifyUserById.do'),
        /**
         * 个人中心 - 我的动态
         */
        person_mine_actions: u('/tempdata/person_mine_actions.json'),
        /**
         * 个人中心 - 删除自己的动态
         */
        // personal_bbs_delitem: u('/tempdata/personal_bbs_delitem.json'),
        /**
         * 个人中心 - 用户收藏 -资讯列表
         */
        person_shouchang_news: u('/tempdata/news_list.json'),
        /**
         * 个人中心 - 用户收藏 -商品列表
         */
        person_shouchang_goods: u('/tempdata/home_goods.json'),
        /**
         * 个人中心 - 用户收藏 -帖子列表
         */
        person_shouchang_bbs: u('/tempdata/community_share_list.json'),
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
        home_banner: u('/tempdata/banners.json'),
        /**
         * 首页标签
         */
        home_marks: u('/tempdata/home_marks.json'),
        /**
         * 首页商品列表
         */ 
        home_good_list: u('/tempdata/home_goods.json'),
        /**
         * 首页-热门商品列表
         */ 
        home_hot_good_list: u('/xiaomo/vmgoods_UIHotRecommendList.do'),
        /**
         *首页商品详情
         */
        home_good_detail: u('/tempdata/home_good_detail.json'),
        /**
         * 商品 评论列表
         */
        good_pinglun_list: u('/tempdata/good_pinglun_list.json'),
        /**
         * 服务商品 评论列表
         */
        servergood_pinglun_list: u('/tempdata/servergood_pinglun_list.json'),
        /**
         * 保险商品 评论列表
         */
        insugood_pinglun_list: u('/tempdata/insugood_pinglun_list.json'),
        /**
         * 商品 添加评论
         */
        good_add_pinglun: u('/tempdata/good_add_pinglun.json'),
        /**
         * 商品 收藏 
         */
        good_shouchang: u('/tempdata/good_shouchang.json'),
        /**
         * 商品 浏览量统计
         */
        good_count_view: u('/tempdata/good_count_view.json'),
        /**
         * 购物车 - 添加商品到购物车
         */
        buycar_add_goods: u('/tempdata/buycar_add_goods.json'),
        /**
         * 购物车 - 修改购物车商品
         */
        buycar_edit_goods: u('/tempdata/buycar_edit_goods.json'),
        /**
         * 购物车 - 获取购物车商品列表
         */
        buycar_goods_list: u('/tempdata/buycar_goods_list.json'),
        /**
         * 购物车 - 删除购物车一个商品
         */
        buycar_del_goods: u('/tempdata/buycar_del_goods.json'),
        /**
         * 用户收货地址列表
         */
        user_address_list: u('/tempdata/user_address_list.json'),
        /**
         * 创建用户收货地址
         */
        user_address_create: u('/tempdata/user_address_create.json'),
        /**
         * 编辑用户收货地址
         */
        user_address_edit: u('/tempdata/user_address_edit.json'),
        /**
         * 删除用户收货地址
         */
        user_address_delete: u('/tempdata/user_address_delete.json'),
        /**
         * 订单-创建
         */
        order_action_create: u('/tempdata/order_action_create.json'),
        /**
         * 订单-详情信息
         */
        order_action_info: u('/tempdata/order_action_info.json'),
        /**
         * 订单-我的订单列表
         */
        order_action_mylist: u('/tempdata/order_action_mylist.json'),
        /**
         * 订单-根据父订单号取消订单
         */
        order_action_cancel: u('/xiaomo/order_UICancelOrderByParentId.do'),
        /**
         * 搜索-热门标签
         */
        search_hot_marks: u('/tempdata/search_hot_marks.json'),
        /**
         * 商品详情-猜你喜欢-列表数据
         */
        gust_like_data: u('/tempdata/gust_like_data.json'),
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
        pinglun_action_itemdetail: u('/tempdata/pinglun_action_itemdetail.json'),
















        
        
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
        return path+"?v="+new Date().getTime();
    }
 })(window);