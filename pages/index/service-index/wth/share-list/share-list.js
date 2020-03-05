// pages/index/service-index/wth/share-list/share-list.js
const HTTP = require('../../../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreBtnUrl: "",
    shareData: [],
    materialImgBac: "/images/chat/personBacImg.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "患友分享"
    });
    let that = this;
    that.data.httpParams = JSON.parse(options.httpParams);
    let a = that.data.httpParams;
    that.patientShareList(a.orgID, a.sectionID, a.doctorStaffID);
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

  },
  toDetail: function(e) {
    let that = this;
    // console.log(e.currentTarget.dataset.detailurl);
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "标题", // 待确认，可先不传
      url: e.currentTarget.dataset.detailurl, // （必传）图文、视频 的网络地址链接
      logoUrl: "" // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },
  // 获取患者分享列表
  patientShareList: function(orgID, sectionID, doctorStaffID) {
    let that = this;
    HTTP.patientShareList({
      orgID: orgID,
      sectionID: sectionID,
      doctorStaffID: doctorStaffID,
      pageIndex: 1,
      pageSize: 100
    }).then(res => {
      // console.log("获取的患者ASDASD：" + JSON.stringify(res.data));
      if (res.data) {
        that.setData({
          ["shareData"]: res.data.datas
        });
        // console.log(this.data.patientShareGetData);
      }
    });
  }
})