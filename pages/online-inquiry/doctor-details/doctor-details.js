const HTTP = require('../../../utils/http-util')

Page({
  data: {
    list: [
      {
        name: '张**',
        leve: '2',
        content: '医生的回答很好的解决了我的问题，很不错。'
      }
    ]
  },
  onLoad: function (e) {
    var doctorId = e.doctorId
    this.fetchDoctorInfo(doctorId)
  },
  // 获取主治医师信息
  fetchDoctorInfo(doctorId) {
    
    wx.showLoading({
      title: '获取主治医师信息....',
    })
    var that = this;
    HTTP.getDoctorInfo({
      staffID: doctorId
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data) {
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
})