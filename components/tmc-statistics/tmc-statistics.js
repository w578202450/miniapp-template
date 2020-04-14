const HTTP = require('../../utils/http-util');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 统计计数查询
     * systemCode: "", // 必传 网关 如:tmc
     * bizCode: "", // 必传 点赞对象属于哪个模块code 如:文章模块传article
     * objectID: "", // 必传 操作对象id 如文章点赞 传文章id
     * statisticsCode: "", // 必传 统计code 如:觉得有用操作 传userful
     * orgID: "", // 非必传 机构id 如:该操作对象属于哪个机构
     * deptID: "", // 非必传 暂时不管
     * userID:''
     */
    queryParams: {
      type: Object,
      value: null
    },
    /**
     * 统计对象类型 useful view
     */
    type: {
      type: String,
      value: ""
    },
    /**
     * 是否展示左侧图片
     */
    isShowIcon: {
      type: Boolean,
      value: false
    },
    /**
     * 图片资源
     */
    icon: {
      type: String,
      value: ""
    },
    /**
     * 人数 默认未0
     */
    count: {
      type: Number,
      value: 0
    }
  },


  observers: {
    "type": function(type) {
      if (!type || type.length === 0) {
        return;
      }
      this.handleBaseInfoByType(type);
    },
    'queryParams': function(queryParams) {
      if (!queryParams || Object.keys(queryParams).length === 0) {
        return;
      }
      this.queryStatistics(queryParams);

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 基本样式处理
     * textStyle 文本样式
     * text 文本内容
     */
    handleBaseInfoByType(type) {

      // 觉得有用
      if (type === "useful") {
        this.setData({
          baseInfo: {
            textStyle: "color: rgba(67, 139, 239, 1)",
            text: "觉得有用"
          }
        })
        // 观看人数
      } else if (type === "view") {
        this.setData({
          baseInfo: {
            textStyle: "color: rgba(0, 0, 0, 0.65)",
            text: "已观看"
          }
        })
      }
    },
    /**
     * 计数查询
     */
    queryStatistics(params) {
      HTTP.queryStatistics(params).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          this.setData({
            count: res.data.statisticsCount
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 3000
          })
        }
      }).catch(error => {
        wx.hideLoading();
        wx.showToast({
          title: "网络连接失败",
          icon: "none",
          duration: 3000
        })
      });
    }

  }
})