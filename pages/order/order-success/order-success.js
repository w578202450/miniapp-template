// pages/order/order-success/order-success.js
const commonFun = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paySuccessIconSrc: "/images/order/paySuccessIcon.png",
    paramsData: ""  // 字符窜形式的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("进入订单完成页的参数：" + JSON.stringify(options));
    this.setData({
      paramsData: options.paramsData
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**操作：返回首页 */
  navBackToIndex: function() {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  },

  /**操作：立即评价 */
  toEvaluateFun: function() {
    wx.navigateTo({
      url: '/pages/order/order-evaluate/order-evaluate?paramsData=' + this.data.paramsData
    });
  }
})