
const HTTP = require('../../../utils/http-util')

Page({
  data: {
    params: {},
    noNetwork: false,
    noData: false,
    list: [
      {
        "rpType": 0,
        "assistantName": "19122116554357936820511001",
        "addTime": "2019-12-30 20:14:21",
        "reviewResult": "19122116554357936820511001",
        "consultDisease": "19122116554357936820511001",
        "addUser": "19122116554357936820511001",
        "duration": 0,
        "modifyUser": "",
        "doctorName": "19122116554357936820511001",
        "modifyTime": "2019-12-30 20:14:09",
        "price": 0,
        "pharmacistStaffID": "19122116554357936820511001",
        "yunRpStatus": 0,
        "patientName": "19122116554357936820511001",
        "doctorStaffID": "19122116554357936820511001",
        "rpStatus": 0,
        "patientID": "19122116554357936820511001",
        "orderID": "19122116554357936820511001",
        "yunRpID": "19122116554357936820511001",
        "isDelete": 0,
        "sex": 0,
        "rpFileStampFileUrl": "19122116554357936820511001",
        "keyID": "19122120142148483433012001",
        "diagnosis": "19122116554357936820511001",
        "rpFileStampFileID": "19122116554357936820511001",
        "orgID": "19122116554357936820511001",
        "rpImgFileID": "19122116554357936820511001",
        "rpTime": "2019-11-11 00:00:00",
        "rpImgFileUrl": "19122116554357936820511001",
        "assistantStaffID": "19122116554357936820511001",
        "reviewStatus": 0,
        "payStatus": 0,
        "age": 0,
        "reviewTime": "2019-11-11 00:00:00"
      },
      {
        "rpType": 0,
        "assistantName": "19122116554357936820511001",
        "addTime": "2019-12-30 20:15:47",
        "reviewResult": "19122116554357936820511001",
        "consultDisease": "19122116554357936820511001",
        "addUser": "19122116554357936820511001",
        "duration": 0,
        "modifyUser": "",
        "doctorName": "19122116554357936820511001",
        "modifyTime": "2019-12-30 20:15:35",
        "price": 0,
        "pharmacistStaffID": "19122116554357936820511001",
        "yunRpStatus": 0,
        "patientName": "19122116554357936820511001",
        "doctorStaffID": "19122116554357936820511001",
        "rpStatus": 0,
        "patientID": "19122116554357936820511001",
        "orderID": "19122116554357936820511001",
        "yunRpID": "19122116554357936820511001",
        "isDelete": 0,
        "sex": 0,
        "rpFileStampFileUrl": "19122116554357936820511001",
        "keyID": "19122120154667031613012001",
        "diagnosis": "19122116554357936820511001",
        "rpFileStampFileID": "19122116554357936820511001",
        "orgID": "19122116554357936820511001",
        "rpImgFileID": "19122116554357936820511001",
        "rpTime": "2019-11-11 00:00:00",
        "rpImgFileUrl": "19122116554357936820511001",
        "assistantStaffID": "19122116554357936820511001",
        "reviewStatus": 0,
        "payStatus": 0,
        "age": 0,
        "reviewTime": "2019-11-11 00:00:00"
      },
      {
        "rpType": 0,
        "assistantName": "19122116554357936820511001",
        "addTime": "2019-12-30 20:15:58",
        "reviewResult": "19122116554357936820511001",
        "consultDisease": "19122116554357936820511001",
        "addUser": "19122116554357936820511001",
        "duration": 0,
        "modifyUser": "",
        "doctorName": "19122116554357936820511001",
        "modifyTime": "2019-12-30 20:15:46",
        "price": 0,
        "pharmacistStaffID": "19122116554357936820511001",
        "yunRpStatus": 0,
        "patientName": "19122116554357936820511001",
        "doctorStaffID": "19122116554357936820511001",
        "rpStatus": 0,
        "patientID": "19122116554357936820511001",
        "orderID": "19122116554357936820511001",
        "yunRpID": "19122116554357936820511001",
        "isDelete": 0,
        "sex": 0,
        "rpFileStampFileUrl": "19122116554357936820511001",
        "keyID": "19122120155807127243012001",
        "diagnosis": "19122116554357936820511001",
        "rpFileStampFileID": "19122116554357936820511001",
        "orgID": "19122116554357936820511001",
        "rpImgFileID": "19122116554357936820511001",
        "rpTime": "2019-11-11 00:00:00",
        "rpImgFileUrl": "19122116554357936820511001",
        "assistantStaffID": "19122116554357936820511001",
        "reviewStatus": 0,
        "payStatus": 0,
        "age": 0,
        "reviewTime": "2019-11-11 00:00:00"
      }
    ]
  },

  onLoad: function() {
    this.loadDatas()
  },
  // 加载数据
  loadDatas() {
    wx.showLoading();
    this.data.list = [];
    var that = this;
    HTTP.getRpListByPerson({
      orgID: wx.getStorageSync("orgID"),
      patientID: wx.getStorageSync("patientID")
    })
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
  // 加载更多数据
  moreDatas:function(){

  },
  // 无网络
  noNetworkOption: function() {
    this.loadDatas()
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