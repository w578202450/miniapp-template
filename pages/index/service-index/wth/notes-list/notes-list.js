// pages/index/service-index/wth/notes-list/notes-list.js
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
      title: "侯丽萍医生的手记"
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
  toDetail: function(e) {
    let that = this;
    console.log(123);
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "标题", // 待确认，可先不传
      url: "https://apph5.100cbc.com/doctor/agreementRegister.html", // （必传）图文、视频 的网络地址链接
      logoUrl: "" // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  }
})