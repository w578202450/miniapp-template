const HTTP = require('../../../utils/http-util')

Page({
  data: {
    list: [
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病',
        date: '开方日期：2019-10-22',
        status:'待支付',
        button: 1,
        id:0
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '待发货',
        button: 2,
        id: 1
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '已支付',
        button: 3,
        id: 2
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '待发货',
        button: 2,
        id: 3
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        title: '李荣豪医生的治疗方案',
        details: '症状：体弱多病，四肢酸软，腰痛1年多。',
        date: '开方日期：2019-10-22',
        status: '已支付',
        button: 3,
        id: 4
      },
    ]
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
      icon:'none'
    })
    HTTP.getOrderByPerson({
      buyerID:'123',
      orgID:'19122116554357936820511001'
    })
      .then(res => {
        wx.hideLoading();
        
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '获取信息失败',
          icon: 'none',
          duration: 2000
        })
      })
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