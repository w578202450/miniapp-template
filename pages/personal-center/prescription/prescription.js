const app = getApp()

const HTTP = require('../../../utils/http-util')

Page({
  data: {
    params: {}
    // list: [{
    //     date: '2019-12-22',
    //     content: '体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。',
    //     id: 0
    //   },
    //   {
    //     date: '2019-12-22',
    //     content: '体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。',
    //     id: 1
    //   },
    //   {
    //     date: '2019-12-22',
    //     content: '体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。体弱多病，四肢酸软，腰痛1年多。',
    //     id: 2
    //   },
    // ]
  },
  onLoad: function() {
    this.quiryDatas()
  },

  quiryDatas() {
    var that = this;
    wx.getStorage({
      key: 'personInfo',
      success: function(res) {
        that.setData({
          params: {
            orgID: res.data.orgID,
            patientID: res.data.keyID
          },
        })
        wx.showLoading({
          title: '加载中',
        })
        HTTP.getRpListByPerson(that.data.params).then(res => {
          wx.hideLoading()
          if (res.code == 0) {
          }
        })
      }
    })

  },
})