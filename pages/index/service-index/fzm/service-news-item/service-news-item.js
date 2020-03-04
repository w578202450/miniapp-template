// pages/index/service-index/fzm/service-news-item/service-news-item.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    videoIconSrc: "/images/chat/videoPlayIcon.png",
    imagePlaceholder: app.globalData.imagePlaceholder
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})