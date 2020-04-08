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
    materialImgBac: "/images/chat/personBacImg.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "康复案例"
    });
    let that = this;
    that.data.httpParams = JSON.parse(options.httpParams);
    console.log(that.data.httpParams);
    let a = that.data.httpParams;
    that.inquiryCaseList(a.orgID, a.sectionID, a.doctorStaffID);
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

  },
  // 进入详情
  toDetail: function(e) {
    let that = this;
    // console.log(e.currentTarget.dataset.detailurl);
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "", // 待确认，可先不传
      url: encodeURIComponent(e.currentTarget.dataset.detailurl), // （必传）图文、视频 的网络地址链接，需要加密
      logoUrl: encodeURIComponent("") // 视频的封面图片(没有就传空字符窜)，需要加密
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },
  // 获取手记列表
  inquiryCaseList: function(orgID, sectionID, doctorStaffID) {
    let that = this;
    HTTP.inquiryCaseList({
      orgID: orgID,
      sectionID: sectionID,
      doctorStaffID: doctorStaffID,
      pageIndex: 1,
      pageSize: 100
    }).then(res => {
      // console.log("获取的患者ASDASD：" + JSON.stringify(res.data));
      if (res.data) {
        that.setData({
          ["inquiryCaseData"]: res.data.datas
        });
        // console.log(this.data.patientShareGetData);
      }
    });
  },

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
  }
})