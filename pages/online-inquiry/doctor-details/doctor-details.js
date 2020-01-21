const HTTP = require('../../../utils/http-util')
let app = getApp()
Page({
  data: {
    screenWidth: app.globalData.systemInfo.screenWidth,
    list: [
      {
        name: '张**',
        leve: '2',
        content: '医生的回答很好的解决了我的问题，很不错。'
      }
    ]
  },
  onLoad: function (e) {
    var staffID = e.staffID
    this.fetchDoctorInfo(staffID)
  },

  // 获取主治医师信息
  fetchDoctorInfo(doctorId) {
    var that = this;
    HTTP.getDoctorInfo({
      staffID: doctorId
    })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.setData({
              doctorInfo: res.data
            })
            this.getDoctorDiseaseByDoctorID(res.data.doctorID)
          }
        } else {
          wx.showToast({
            title: res.message,
            icon:'none'
          })
        }
      }).catch(e => {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  },

  getDoctorDiseaseByDoctorID(doctorId){
    var that = this;
    HTTP.getDoctorDiseaseByDoctorID({
      doctorID: doctorId
    })
      .then(res => {
        console.log('getDoctorDiseaseByDoctorID-----',res)
        if (res.code == 0) {
          if (res.data) {
            var disease = []
            for (var index in res.data) {
              disease.push(res.data[index].diseaseName) 
            }
            this.setData({
              disease: disease.join(',')
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  }
})