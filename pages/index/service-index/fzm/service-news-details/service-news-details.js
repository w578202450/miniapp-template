var WxParse = require('../../../../../components/wxParse/wxParse.js');
const HTTP = require('../../../../../utils/http-util');
const commonFun = require('../../../../../utils/common.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDatas: {}, // 文章详情
    inquiryIcon: "/images/inquiry/inquiry_article_add.png",
    queryStatusParamsOfUseful: {}, // 查询觉得有用按钮状态参数
    queryStatisticsParamsOfUseful: {}, // 查询觉得有用统计计数
    queryStatisticsParamsOfView: {}, // 查询观看统计计数
    increaseParamsOfView: {}, // 观看统计计数
    increaseParamsOfUserful: {}, // 觉得有用统计计数
    hasView: false //是否记录观看
  },

  /**
   * 卸载页面
   */
  onUnload: function() {
    if (this.data.hasView) {
      const pages = getCurrentPages();
      const perpage = pages[pages.length - 2]
      perpage.refreshStatistics('article', 'view');

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.articleDatas = JSON.parse(options.httpParams);
    this.initInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },
  /**
   * 分享
   */
  onShareAppMessage: function() {
    let httpParams = 'httpParams=' + JSON.stringify(this.articleDatas);
    return commonFun.onShareAppMessageFun("/pages/index/service-index/fzm/service-news-details/service-news-details", httpParams);
  },
  /**
   * 数据初始化
   */
  initInfo() {
    // 获取文章详情
    this.getArticleByKeyID();
    // 观看计数
    this.viewCountIncrease();
    // 动态设置标题
    wx.setNavigationBarTitle({
      title: this.articleDatas.title
    })
    // 组件参数初始化
    this.data.queryStatusParamsOfUseful = {
      systemCode: "tmc",
      bizCode: "article",
      objectID: this.articleDatas.keyID,
      operateCode: "useful",
      operateID: app.globalData.patientID,
      orgID: "",
      deptID: ""
    };
    this.data.increaseParamsOfUserful = {
      systemCode: "tmc",
      bizCode: "article",
      objectID: this.articleDatas.keyID,
      statisticsCode: "useful",
      operatorID: app.globalData.patientID
    };
    this.data.queryStatisticsParamsOfUseful = {
      systemCode: "tmc",
      bizCode: "article",
      objectID: this.articleDatas.keyID,
      statisticsCode: "useful",
      orgID: "",
      deptID: "",
      userID: ''
    };
    this.data.queryStatisticsParamsOfView = {
      systemCode: "tmc",
      bizCode: "article",
      objectID: this.articleDatas.keyID,
      statisticsCode: "view",
      orgID: "",
      deptID: "",
      userID: ''
    };
    this.setData({
      queryStatusParamsOfUseful: this.data.queryStatusParamsOfUseful,
      increaseParamsOfUserful: this.data.increaseParamsOfUserful,
      queryStatisticsParamsOfUseful: this.data.queryStatisticsParamsOfUseful,
      queryStatisticsParamsOfView: this.data.queryStatisticsParamsOfView
    })
  },
  /**
   * 获取文章类容
   */
  getArticleByKeyID() {

    HTTP.getArticleByKeyID({
      "keyID": this.articleDatas.keyID,
    }).then(res => {
      console.log('getArticleByKeyID--------', res)
      if (res.code == 0 && res.data) {
        if (res.data.articleType === 0) {
          WxParse.wxParse('article', 'html', res.data.content, this, 20);
        }
        this.setData({
          articleData: res.data,
          conmmentQueryParams: {
            systemCode: "tmc",
            bizCode: "article",
            objectID: this.articleDatas.keyID
          },
          conmmentPublishParams: {
            systemCode: "tmc",
            bizCode: "article",
            deptID: this.articleDatas.departmentId,
            userID: this.articleDatas.doctorId,
            objectID: this.articleDatas.keyID
          }
        })
      }
    })
  },
  /**
   * 观看次数记数
   */
  viewCountIncrease() {
    this.data.increaseParamsOfView = {
      systemCode: "tmc",
      bizCode: "article",
      objectID: this.articleDatas.keyID,
      statisticsCode: "view",
      operatorID: app.globalData.patientID
    };
    HTTP.statisticsIncrease(this.data.increaseParamsOfView).then(res => {
      if (res.code === 0) {
        this.data.hasView = res.data;
      }
    });
  },
  /**
   * 操作：开始问诊
   * 1.已登录，直接到问诊页
   * 2.未登录，授权登录
   *  */
  toOnlineInqueryFun: function() {
    if (app.globalData.isInitInfo) {
      wx.navigateTo({
        url: '/pages/online-inquiry/inquiry/chat/chat'
      });
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  },
  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  },
  /**
   * 组件登录操作
   */
  login() {
    this.popup.showPopup(""); // 显示登录确认框
  },
  /**
   * 觉得有用组件点赞成功
   * 1.刷新当前界面觉得有用状态和点赞数据
   * 2.刷新上一个界面的数据
   */
  likeSucess() {
    // 刷新当前界面觉得有用状态和点赞数据
    let statistics = this.selectComponent("#statistics");
    statistics.queryStatistics(this.data.queryStatisticsParamsOfUseful);
    // 刷新上一个界面
    const pages = getCurrentPages();
    const perpage = pages[pages.length - 2]
    perpage.refreshStatistics('article', 'useful');
  }
})