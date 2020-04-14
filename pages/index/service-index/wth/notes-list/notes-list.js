// pages/index/service-index/wth/notes-list/notes-list.js
const HTTP = require('../../../../../utils/http-util');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreBtnUrl: "",
    contentText: "",
    inquiryCaseData: [],
    materialImgBac: "/images/chat/personBacImg.png",
    httpParams: {},
    pageInfo: {
      pageSize: 5,
      pageIndex: 1
    },
    selectedIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "康复案例"
    });
    this.data.httpParams = JSON.parse(options.httpParams);
    this.inquiryCaseList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

  /**
   * 查看详情
   */
  toDetail: function(e) {
    this.data.selectedIndex = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    item.content = encodeURIComponent(item.content);
    wx.navigateTo({
      url: "/pages/index/service-index/wth/notes-details/notes-details?personData=" + JSON.stringify(item) // 传输对象、数组时，需要转换为字符窜
    });
  },
  /**
   * 获取手记列表
   */
  inquiryCaseList() {
    wx.showLoading({
      title: '加载中...',
    })
    HTTP.inquiryCaseList({
      orgID: this.data.httpParams.orgID,
      sectionID: this.data.httpParams.sectionID,
      doctorStaffID: this.data.httpParams.doctorStaffID,
      ...this.data.pageInfo
    }).then(res => {
      wx.hideLoading();
      if (res.data) {
        this.data.pageInfo = res.data.pageInfo;
        this.data.inquiryCaseData = this.data.inquiryCaseData.concat(res.data.datas)
        this.setData({
          pageInfo: this.data.pageInfo,
          pageDatas: res.data.datas
        });
        this.handleStatisticsDatas();
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
    });;
  },

  /**
   *  获取统计数据
   */
  handleStatisticsDatas(currentCategoryData, classifyID) {
    if (this.data.inquiryCaseData.length === 0) {
      return;
    }
    var objectIDList = []
    this.data.inquiryCaseData.forEach(function(element) {
      objectIDList.push(element.keyID);
    });

    this.usefulStatisticsListRequest(objectIDList);
    this.viewStatisticsListRequest(objectIDList);
  },
  /**
   * 觉得有用计数列表查询
   */
  usefulStatisticsListRequest(objectIDList) {
    let usefulParams = {
      "systemCode": "tmc",
      "bizCode": "inquiryCase",
      "objectIDList": objectIDList,
      "statisticsCode": "useful"
    };
    HTTP.queryStatisticsList(usefulParams).then(res => {
      if (res.code === 0 && res.data) {
        this.data.inquiryCaseData.forEach(function(item) {
          res.data.forEach(element => {
            if (item.keyID === element.objectID) {
              item.usefulNum = element.statisticsCount
            }
          })
        });
        this.setData({
          inquiryCaseData: this.data.inquiryCaseData
        });
      }
    });
  },
  /**
   * 观看数列表计数列表查询
   */
  viewStatisticsListRequest(objectIDList) {
    let viewParams = {
      "systemCode": "tmc",
      "bizCode": "inquiryCase",
      "objectIDList": objectIDList,
      "statisticsCode": "view"
    };
    HTTP.queryStatisticsList(viewParams).then(res => {
      if (res.code === 0 && res.data) {

        this.data.inquiryCaseData.forEach(function(item) {
          res.data.forEach(element => {

            if (item.keyID === element.objectID) {
              item.viewNum = element.statisticsCount
            }
          })
        });
        this.setData({
          inquiryCaseData: this.data.inquiryCaseData
        });
      }
    });
  },
  /**
   * 问诊
   */
  goInquiry() {
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
   * 加载更多
   */
  loadMoreData() {
    this.data.pageInfo.pageIndex += 1;
    this.inquiryCaseList();
  },

  /**
   * 当前item 记录点赞有用数
   */
  refreshInquiryLikeSuccess() {
    let item = this.data.inquiryCaseData[this.data.selectedIndex];
    if (!item.usefulNum) {
      item.usefulNum = 0;
    }
    item.usefulNum += 1;
    this.setData({
      inquiryCaseData: this.data.inquiryCaseData
    });
  },
  /**
   * 当前item 记录观看数
   */
  refreshInquiryViewSuccess() {
    let item = this.data.inquiryCaseData[this.data.selectedIndex];
    if (!item.viewNum) {
      item.viewNum = 0;
    }
    item.viewNum += 1;
    this.setData({
      inquiryCaseData: this.data.inquiryCaseData
    });
  },
})