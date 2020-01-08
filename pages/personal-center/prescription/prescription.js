const app = getApp()

const HTTP = require('../../../utils/http-util')

Page({
  data: {
    params: {},
    noNetwork: false,
    noData: false,
    list: {}
  },
  onLoad: function() {
    this.loadDatas()
  },

  loadDatas() {
    wx.showLoading();
    this.data.list = [];
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
        HTTP.getRpListByPerson(that.data.params)
          .then(res => {
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
            that.setData({
              noNetwork: true
            })
          })

      },
      fail:function(){
        wx.hideLoading();
      }
    })
    
  },

  moreDatas:function(){

  },

  noNetworkOption: function() {
    this.loadDatas()
  },

  noDataOption: function() {

  }

})