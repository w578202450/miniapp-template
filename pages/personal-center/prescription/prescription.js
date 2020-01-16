
const HTTP = require('../../../utils/http-util')

Page({
  data: {
    params: {},
    noData: false,
    list: null
  },

  onLoad: function() {
    this.loadDatas()
  },
  
  onPullDownRefresh(){
    this.loadDatas()
  },
  /**
   * 获取处方列表
   */
  loadDatas() {
    wx.showLoading({
      title: '加载中...',
    });
    this.data.list = [];
    var that = this;
    HTTP.getRpListByPerson({
      orgID: wx.getStorageSync("orgID"),
      patientID: wx.getStorageSync("patientID")
    })
      .then(res => {
        wx.stopPullDownRefresh()
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data.length == 0) {
            that.setData({
              noData: true
            })
          } else {
            this.data.list = this.data.list.concat(res.data)
            that.setData({
              list: this.data.list
            })
          }
        }
      }).catch(e => {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      })
  },
  // 加载更多数据
  moreDatas:function(){

  },
  // 无数据
  noDataOption: function(e) {
    wx.navigateTo({
      url: '/pages/online-inquiry/inquiry/chat/chat',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})