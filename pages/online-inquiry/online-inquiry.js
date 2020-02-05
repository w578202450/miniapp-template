//index.js
//获取应用实例

const HTTP = require('../../utils/http-util')
const app = getApp()

Page({
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    screenHeight: app.globalData.systemInfo.screenHeight,
    screenWidth: app.globalData.systemInfo.screenWidth,
    pixelRatio: app.globalData.systemInfo.pixelRatio
  },
  onLoad: function() {
    console.log('systemInfo--', app.globalData.systemInfo)
    this.fetchDoctorInfo()
    this.fetchAssistantDoctorInfo()
  },
  
  doctorDetailTap: function(e) {
    var index = e.currentTarget.dataset.index
    var staffID = index == '0' ? app.globalData.personInfo.doctorStaffID : app.globalData.personInfo.assistantStaffID
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details?staffID=' + staffID,
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
      staffID: app.globalData.personInfo.doctorStaffID
    })
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          if (res.data) {
            app.globalData.doctorInfo = res.data
            wx.setStorageSync('doctorInfo', res.data)
            // this.fetchDoctorQualification(res.data.doctorID)
            this.setData({
              doctorInfo: res.data,
              orgName: app.globalData.orgName
            })
          }
        } 
      }).catch(e => {
        wx.hideLoading()
        that.setData({
          noNetwork: true
        })
      })
  },

  // 获取助理医生信息
  fetchAssistantDoctorInfo() {
    var that = this;
    HTTP.getDoctorInfo({
      staffID: app.globalData.personInfo.assistantStaffID
    })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            wx.setStorageSync('assistantInfo', res.data)
            app.globalData.assistantInfo = res.data
            that.setData({
              assistantDoctorInfo: res.data
            })
          }
        }
      }).catch(e => {
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
        if (res.code == 0) {
          that.setData({
            certifyInfo: res.data
          })
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        })
      })
  },
})