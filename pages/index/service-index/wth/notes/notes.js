// pages/index/service-index/wth/notes/notes.js
// const HTTP = require('../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    moreBtnUrl: "",
    paersonInfo: {
      imgSrc: "/images/chat/personBacImg.png",
        name: "匿名用户",
        address: "****",
        date: "2020-01-01"
    },
    contentText: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail:function() {
      wx.showToast({
          title: '跳往',
          icon: "none",
          duration: 3000
        });
    }
  }
})
