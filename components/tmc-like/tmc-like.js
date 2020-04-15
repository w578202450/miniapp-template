const HTTP = require('../../utils/http-util');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 查询计数
     * systemCode 必传 网关 如:tmc
     * bizCode 必传 点赞对象属于哪个模块code 如:文章模块传article
     * objectID 必传 操作对象id 如文章点赞 传文章id
     * operateCode 必传 操作code 如:觉得有用操作 useful
     * operateID 必传 操作者id 一般指用户id
     * orgID 非必传 机构id 如:该操作对象属于哪个机构
     * deptID 非必传 暂时不管
     */
    queryParams: {
      type: Object,
      value: {
        systemCode: "",
        bizCode: "",
        objectID: "",
        operateCode: "",
        operateID: "",
        orgID: "",
        deptID: ""
      }
    },
    /**
     * 计数
     * systemCode // 必传 网关 如:tmc
     * bizCode 必传 点赞对象属于哪个模块code 如:文章模块传article
     * objectID 必传 操作对象id 如文章点赞 传文章id
     * statisticsCode 必传 操作code 如: 觉得有用操作 useful
     * operatorID 非必传 操作者id 一般指用户id
     */
    increaseParams: {
      type: Object,
      value: {
        systemCode: "",
        bizCode: "",
        objectID: "",
        statisticsCode: "",
        operatorID: ""
      }
    },
    /**
     * 类型 useful view 等  
     * 用于区分界面样式
     */
    type: {
      type: String,
      value: ""
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    baseInfo: {}, // 图片信息,
    disable: false // 是否可以点击
  },

  observers: {
    "type": function(type) {
      if (!type || type.length === 0) {
        return;
      }
      this.handleStatusChange(type, this.data.disable);
    },

    "disable": function(disable) {
      this.handleStatusChange(this.data.type, disable);
    },

    'queryParams': function(queryParams) {
      if (!queryParams || Object.keys(queryParams).length === 0) {
        return;
      }
      HTTP.queryStatus(queryParams).then(res => {
        this.setData({
          disable: res.data
        })
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 基本样式处理
     * icon 图标
     * pageStyle page样式
     * textStyle 文本样式
     * text 文本内容
     */
    handleStatusChange(type, disable) {
      // 觉得有用
      if (type === "useful") {
        this.setData({
          baseInfo: {
            icon: disable ? "/images/inquiry/inquiry_article_like_disable.png" : "/images/inquiry/inquiry_article_like.png",
            pageStyle: disable ? "background:rgba(217,217,217,1)" : "background:rgba(67,139,239,0.1)",
            textStyle: disable ? "color:rgba(255,255,255,1);" : "color:rgba(67,139,239,1)",
            text: "觉得有用"
          }
        })
      }
    },
    /**
     * 按钮操作
     */
    tapAction() {
      if (this.data.disable) {
        return;
      } else {
        if (app.globalData.isInitInfo) {
          this.likeRequest();
        } else {
          this.triggerEvent('login')
        }
      }
    },
    /**
     * 操作请求网络请求
     */
    likeRequest() {
      wx.showLoading({
        title: '等待...',
      })
      HTTP.statisticsIncrease(this.data.increaseParams).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          this.data.disable = true;
          wx.showToast({
            icon: "none",
            title: '您的一分肯定，是我们前进的动力',
            duration: 3000
          })
          this.setData({
            disable: true
          })
          // this.triggerEvent('success')
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