//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    roomname: "付志敏的互联网诊所",
    roomdes: "网上咨询·在线开药·预约就诊",
    qualificationDes: "12313456DFGHJJJKN",
    licensingDes: "12313456DFGHJJJKN",
  },
  onLoad: function() {

  },
  doctorDetailTap: function() {
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  userInfoHandler:function(){
    
  }
})