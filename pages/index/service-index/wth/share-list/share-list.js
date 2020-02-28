// pages/index/service-index/wth/share-list/share-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreBtnUrl: "",
    paersonInfo: {
        imgSrc: "/images/chat/personBacImg.png",
        name: "匿名用户",
        address: "****",
        date: "2020-01-01"
    },
    contentText: "asdasd",
    arry: [{},{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "患者分享"
    });
    let that = this;
    that.data.httpParams = JSON.parse(options.httpParams);
    console.log(that.data.httpParams);
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

  },
  toDetail: function() {
    let that = this;
    console.log(333);
  }
})