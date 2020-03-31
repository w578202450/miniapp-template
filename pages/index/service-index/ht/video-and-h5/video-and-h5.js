// pages/index/service-index/ht/video-and-h5/video-and-h5.js
const commonFun = require('../../../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialInfo: {
      materialType: -1, // 0:图文 1:视频
      title: "", // 标题
      videoMaterialSrc: "", // 图文、视频文件网络地址路径
      posterSrc: "" // 视频封面图路径
    },
    htmlStr:"<title>桃子医生端</title>"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("进入H5展示的参数：" + JSON.stringify(options));
    if (options.materialData) {
      let acceptOptions = JSON.parse(options.materialData); // 接收数组、对象转换的字符窜时，需要把格式转换回来
      console.log(acceptOptions);
      if (acceptOptions.materialType || acceptOptions.materialType == 0) {
        let newUrl = decodeURIComponent(acceptOptions.url);
        let newLogoUrl = decodeURIComponent(acceptOptions.logoUrl);
        that.setData({
          materialInfo: {
            title: (acceptOptions.title && acceptOptions.title.length > 0) ? acceptOptions.title : "",
            videoMaterialSrc: newUrl,
            posterSrc: newLogoUrl,
            materialType: acceptOptions.materialType
          }
        });
        console.log(that.data.materialInfo);
      } else {
        wx.showToast({
          title: '素材数据异常，无法正常展示',
          icon: "none",
          duration: 3000
        });
      }
    } else {
      wx.showToast({
        title: '素材数据异常，无法正常展示',
        icon: "none",
        duration: 3000
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext("myVideos");
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
    return commonFun.onShareAppMessageFun(); // 调用公共的分享配置
  },

  errorFun: function(e) {
    console.log("视频播放错误" + JSON.stringify(e));
    wx.showToast({
      title: "视频异常，无法正常播放",
      icon: "none",
      duration: 3000
    });
  }
})