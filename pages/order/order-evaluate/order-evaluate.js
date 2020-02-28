// pages/order/order-evaluate/order-evaluate.js
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: "", // 评价的订单ID
    orgID: "", // 订单所属 医院ID
    orderDetailData: {}, // 订单详情
    rpDetailData: [
      { productBrand: "康森", medicineName: "藿香正气水霍香正气水防暑霍香正气液少时诵诗书", productSpec: "10ml/支*10", imgUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png" },
      { }
    ] // 处方详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("评价页接收到的参数：" + JSON.stringify(options));
    if (options.orderID) {
      that.setData({
        orderID: options.orderID,
        orgID: options.orgID
      });
    }
    // that.getOrderDetailFun(); // 查询订单详情
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

  /**
   * 查询：订单详情 
   * */
  getOrderDetailFun: function() {
    let that = this;
    let params = {
      orderID: that.data.orderID,
      orgID: that.data.orgID
    };
    HTTP.goodsOrder(params).then(res => {
      if (res.data) {
        that.setData({
          orderDetailData: res.data
        });
        that.getRpDetailFun(res.data.rpID); // 查询处方详情
      }
    });
  },

  /**
   * 查询：处方详情 
   * */
  getRpDetailFun: function (rpID) {
    let that = this;
    let params = {
      rpID: rpID
    };
    HTTP.goodsOrder(params).then(res => {
      if (res.data) {
        that.setData({
          rpDetailData: res.data
        });
      }
    });
  },

  /**
   * 操作：提交评价
   */
})