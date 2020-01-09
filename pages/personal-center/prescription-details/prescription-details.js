const HTTP = require('../../../utils/http-util')

Page({
  data: {
    tipShow: true, //是否展示tip提示
    payShow: true, //是否展示支付界面
    info: {
      "rp": {
        "keyID": "11111",
        "orgID": "19122116554357936820511001",
        "patientID": "11111",
        "inquiryID": "1",
        "personID": "",
        "patientName": "11111",
        "sex": 0,
        "age": 0,
        "consultDisease": "11111",
        "diagnosis": "11111",
        "rpAdvice": "11111",
        "duration": 0,
        "price": 0,
        "rpStatus": 0,
        "payStatus": 0,
        "rpType": 0,
        "assistantStaffID": "11111",
        "assistantName": "11111",
        "doctorStaffID": "11111",
        "doctorName": "11111",
        "rpTime": "1900-01-01 00:00:00.0",
        "pharmacistStaffID": "11111",
        "reviewTime": "1900-01-01 00:00:00.0",
        "reviewStatus": 0,
        "reviewResult": "1",
        "orderID": "1",
        "yunRpStatus": 0,
        "yunRpID": "111111",
        "rpFileStampFileID": "11111",
        "rpFileStampFileUrl": "11111",
        "rpImgFileID": "11111",
        "rpImgFileUrl": "11111",
        "addUser": "11111",
        "addTime": "1900-01-01 00:00:00.0",
        "modifyUser": "11111",
        "modifyTime": "2020-01-04 16:01:45.0",
        "isDelete": 0
      },
      "rpMedicines": []
    }
  },
  payAction: function() {
    wx.navigateTo({
      url: '/pages/address/address-submit/address-submit',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function(e) {
    var inquiryID = e.inquiryID;
    var orgID = e.orgID;
    console.log("-e----------", orgID, inquiryID)
    this.loadDatas(orgID, inquiryID);
  },

  // 加载数据
  loadDatas(orgID, inquiryID) {
    // wx.showLoading();
    // this.data.list = [];
    // var that = this;
    // HTTP.getRpInfo({
    //     orgID: orgID,
    //     inquiryID: inquiryID
    //   })
    //   .then(res => {
    //     wx.hideLoading();
    //     if (res.code == 0) {
    //       wx.showToast({
    //         title: '没有数据',
    //         icon: "none"
    //       })
    //     } else {
    //       this.data.info = res.data
    //       that.setData({
    //         info: this.data.info
    //       })
    //     }
    //   }).catch(e => {
    //     wx.hideLoading();
    //     that.setData({
    //       noNetwork: true
    //     })
    //   })
  },
})