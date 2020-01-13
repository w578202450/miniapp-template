const HTTP = require('../../../utils/http-util')

Page({
  data: {
    tipHidden: true, //是否展示tip提示
    payHidden: true //是否展示支付界面
  },
  payAction: function() {
    wx.navigateTo({
      url: '/pages/address/address-submit/address-submit',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function(e) {
    var rpID = e.rpID
    console.log('------eeee--',e.index)
    //处方列表跳转
    this.data.tipHidden = e.index == 0 ? true : false;
    this.data.payHidden = e.index == 0 ? true : false;
    console.log("-e----------", rpID)
    // var inquiryID = e.inquiryID;
    // var orgID = e.orgID;
    // console.log("-e----------", orgID, inquiryID)
    // this.loadDatas(orgID, inquiryID);
    this.getRp(e.rpID)
  },

  // 加载数据
  loadDatas(orgID, inquiryID) {
    // wx.showLoading();
    // this.data.list = [];
    // var that = this;
    // HTTP.getRpInfo({
    //     orgID: orgID,
    //     inquiryID: inquiryID
    //   })
    //   .then(res => {
    //     wx.hideLoading();
    //     if (res.code == 0) {
    //       wx.showToast({
    //         title: '没有数据',
    //         icon: "none"
    //       })
    //     } else {
    //       this.data.info = res.data
    //       that.setData({
    //         info: this.data.info
    //       })
    //     }
    //   }).catch(e => {
    //     wx.hideLoading();
    //     that.setData({
    //       noNetwork: true
    //     })
    //   })
  },

  getRp(rpID) {

    wx.showLoading({
      title: '获取处方详情...',
    });
    var that = this;
    HTTP.getRp({
      rpID: rpID,
      orgID: '19122116554357936820511001'
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.setData({
            rpData: res.data,
            tipHidden: this.data.tipHidden,
            payHidden: this.data.payHidden
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '网络链接失败',
          icon: 'none'
        })
      })
  },
})