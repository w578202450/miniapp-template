const app = getApp()

Page({
  data: {
    list: [
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病',
        date: '开方日期：2019-10-22',
        status:'待支付',
        button: 1
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '已支付',
        button: 2
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '待支付',
        button: 3
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '待支付',
        button: 2
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '待支付',
        button: 3
      },
    ]
  },
  onLoad: function () {

  },

  addressAction: function(){
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  orderDetailsAction:function(){
    wx.navigateTo({
      url: '/pages/order/order-details/order-details',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})