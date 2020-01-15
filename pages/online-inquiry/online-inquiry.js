//index.js
//获取应用实例

const HTTP = require('../../utils/http-util')
const app = getApp()

let systemInfo = wx.getSystemInfoSync();
let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
let navBarHeight = (function () { //导航栏高度
  let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
  return 2 * gap + rect.height;
})();

Page({
  data: {
    statusBarHeight: systemInfo.statusBarHeight,
    navBarHeight: navBarHeight
  },
  onLoad: function() {
    console.log('statusBarHeight--', systemInfo)
    console.log('navBarHeight--', this.data.navBarHeight)
    console.log('capsuleLeft--', rect)
    this.fetchDoctorInfo()
    this.fetchAssistantDoctorInfo()
  },
  

  doctorDetailTap: function(e) {
    var index = e.currentTarget.dataset.index
    var doctorId = index == '0' ? wx.getStorageSync('personInfo').doctorStaffID : wx.getStorageSync('personInfo').assistantStaffID
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details?doctorId=' + doctorId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  userInfoHandler:function(){
    
  },
  // 获取主治医师信息
  fetchDoctorInfo() {
    var that = this;
    HTTP.getDoctorInfo({
      staffID: wx.getStorageSync('personInfo').doctorStaffID
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data) {
            app.globalData.doctorInfo = res.data
            this.fetchDoctorQualification(res.data.doctorID)
            this.setData({
              doctorInfo: res.data
            })
          }
        } else {
          
        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
      })
  },

  // 获取助理医生信息
  fetchAssistantDoctorInfo() {
    var that = this;
    HTTP.getDoctorInfo({
      staffID: wx.getStorageSync('personInfo').assistantStaffID
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              assistantDoctorInfo: res.data
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

  // 获取医生资质编号
  fetchDoctorQualification(doctorID) {
    var that = this;
    HTTP.getDoctorQualification({
      doctorID: doctorID,
      certifyCode: 'PROFESSION'
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          that.setData({
            certifyInfo: res.data
          })
        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
      })
  },
})