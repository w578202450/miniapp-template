// pages/online-inquiry/inquiry/videoPlay/videoPlay.js
const commonFun = require('../../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialType: 0, // 0:图文 1:图片 2:视频
    title: "", // 标题
    descrip: "", // 描述
    videoMaterialSrc: "https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4", // 视频路径
    posterSrc: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg" // 视频封面图路径
    // seeUrl: "https://apph5.100cbc.com/doctor/agreementRegister.html" // 医生注册协议地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.initInfoFun(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext("myVideo");
    // console.log(this.videoContext);
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

  /**
   * 初始化信息
   */
  initInfoFun: function (options) {
    let that = this;
    let acceptOptions = JSON.parse(options.materialData); // 接收数组、对象转换的字符窜时，需要把格式转换回来
    if (acceptOptions.materialType || acceptOptions.materialType == 0) {
      that.setData({
        materialType: acceptOptions.materialType,
        title: acceptOptions.title,
        descrip: acceptOptions.descripm,
        videoMaterialSrc: acceptOptions.url,
        posterSrc: acceptOptions.logoUrl
      });
      console.log("素材信息：" + JSON.stringify(that.data));
      if (acceptOptions.materialType == 0) {

      } else if (acceptOptions.materialType == 2) {
        if (!acceptOptions.url) {
          wx.showToast({
            title: "视频素材异常，无法正常播放",
            icon: "none",
            duration: 3000
          });
        }
      }
    } else {
      wx.showToast({
        title: "素材数据异常，无法正常展示",
        icon: "none",
        duration: 3000
      });
    }
  }
})