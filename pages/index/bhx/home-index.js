// pages/index/bhx/home-index.js
const app = getApp();
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houShiOrgID: "", // 太原侯丽萍风湿骨病医院的机构ID
    shareOrgID: "", // 进入页面携带的orgID
    shareAssistantStaffID: "", // 进入页面携带的医助ID
    // 首页banner
    home_houlipin_hospital_banner:"/images/home/home_houlipin_hospital_banner.png",
    serviceBg: '/images/home/home_service_bg.png',
    goodAts: ["风湿骨科", "针灸"],
    isShowAllContent: false, 
    evaluateData: [], // 院长介绍
    deanContent: "太原侯丽萍风湿骨病中医医院院长，北京中医药大学博士生导师，山西省名中医，国家中医药管理局重点专科…",
    hospitalContent: "太原侯丽萍风湿骨病中医医院系国家中医药管理局“十五”、“十一五”、“十二五”风湿病重点专科医院、太原市二级甲等中医专科医院、山西中医学院教学医院、山西中医类风…",
  },

  /**
   * 生命周期函数--监听页面加载
   *  /**
   * 1.options无参
   *   （1）通过搜索小程序进入时
   * 2.options有参
   *   （1）通过扫码进入时： "q" 的值为url带参
   *   （2）通过分享的小程序进入时：直接带参
   *
   */
  onLoad: function (options) {
    let that = this;
    console.log("进入侯丽萍首页携带的参数：" + JSON.stringify(options));
    if (options) {
      if (options.q) { // 通过扫码进入时：q的值为url带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        var scan_url = decodeURIComponent(options.q);
        let shareOrgID = that.initOptionsFun(scan_url, "orgID");
        let shareAssistantStaffID = that.initOptionsFun(scan_url, "assistantStaffID");
        that.data.shareOrgID = shareOrgID ? shareOrgID : "";
        wx.setStorageSync("shareOrgID", shareOrgID);
        that.data.shareAssistantStaffID = shareAssistantStaffID ? shareAssistantStaffID : "";
        wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
      } else if (options.assistantStaffID) { // 通过分享的小程序进入时：直接带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        if (options.orgID) {
          that.data.shareOrgID = options.orgID;
          wx.setStorageSync("shareOrgID", options.orgID);
        }
        if (options.assistantStaffID) {
          that.data.shareAssistantStaffID = options.assistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
        }
      }
    }
    // 如果orgID不等于侯丽萍医院的orgID，则直接跳转到专家问诊页
    if (that.data.shareOrgID != that.data.houShiOrgID) {
      wx.switchTab({
        url: '/pages/index/service-index/service-index?orgID=' + that.data.shareOrgID + '&assistantStaffID=' + that.data.shareAssistantStaffID
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return commonFun.onShareAppMessageFun();
  },

  /**转换传递的url参数 q */
  initOptionsFun: function (scan_url, name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = scan_url.match(reg);
    if (arr != null) {
      return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    } else {
      return "";
    }
  },

  /**操作：立即进入专家门诊 */
  toServiceIndexFun: function () {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  }
})