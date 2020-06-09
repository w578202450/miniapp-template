const HTTP = require('../../../utils/http-util')
const commonFun = require('../../../utils/common')
import { heartFun,intervalTime } from '../../../utils/heart.js';
let app = getApp()

Page({
  data: {
    timer:null,
    pageName:'我的处方页',
    params: {},
    noData: false,
    list: null
  },

  onLoad: function() {
    this.loadDatas()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.timer=setInterval(() => {
      heartFun(this.data.pageName,this.__route__)
    }, intervalTime);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.timer)
  },

  
  onPullDownRefresh() {
    this.loadDatas()
  },
  /**
   * 获取处方列表
   */
  loadDatas() {
    this.data.list = [];
    var that = this;
    wx.showNavigationBarLoading()
    HTTP.getRpListByPerson({
        orgID: app.globalData.orgID,
        patientID: app.globalData.patientID
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        that.setData({
          noNetwork: false
        })
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
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        that.setData({
          noNetwork: true
        })
      })
  },
  // 加载更多数据
  moreDatas: function() {

  },
  // 无数据
  noDataOption: function(e) {
    wx.navigateTo({
      url: '/pages/online-inquiry/inquiry/chat/chat',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  noNetworkOption() {
    this.loadDatas()
  },

  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  }
})