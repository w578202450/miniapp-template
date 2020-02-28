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
    contentText: "asd",
    httpParams: {
      nextPage: ""
     }
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
