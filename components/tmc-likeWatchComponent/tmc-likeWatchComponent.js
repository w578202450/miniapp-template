// pages/index/service-index/fzm/components/likeWatchComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * true视频类型  false 图文类型
     */
    isImageText: {
      type: Boolean,
      value: false
    },
    /**
     * 点赞数
     */
    likeNum: {
      type: Number,
      value: 0
    },
    /**
     * 观看数
     */
    watchNum: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoIconSrc: "/images/inquiry/inquiry_article_video.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})