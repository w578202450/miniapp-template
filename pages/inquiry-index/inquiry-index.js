// pages/inquiry-index/inquiry-index.js
const app = getApp();
const commonFun = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/loginImg.png", // 宣传图片
    titleTxt: "", // 小标题文字
    btnTxt: "", // 按钮文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.hideTabBarFun();
    this.initFun();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.hideTabBarFun();
    this.initFun();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return commonFun.onShareAppMessageFun();
  },

  initFun: function() {
    console.log(app.globalData.isInitInfo);
    if (app.globalData.isInitInfo) {
      this.setData({
        titleTxt: "点击去问诊，立即开始在线问诊～",
        btnTxt: "立即问诊",
        isInitInfo: true
      });
      // wx.navigateTo({
      //   url: '/pages/online-inquiry/inquiry/chat/chat'
      // });
    } else {
      this.setData({
        titleTxt: "请先登录后使用相应的小程序功能～",
        btnTxt: "立即登录",
        isInitInfo: false
      });
    }
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
  }
})