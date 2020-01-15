//index.js
//获取应用实例

const HTTP = require('../../utils/http-util')


const app = getApp()

Page({
  data: {
  },
  onLoad: function() {
    
    this.fetchDoctorInfo()
    this.fetchAssistantDoctorInfo()
    this.fetchDoctorQualification()
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
  fetchDoctorQualification() {
    var that = this;
    HTTP.getDoctorQualification({
      doctorID: wx.getStorageSync('personInfo').assistantStaffID,
      certifyCode: 'QUALIFICATION'
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data.length > 0) {
            that.setData({
              certifyInfo: res.data
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
})