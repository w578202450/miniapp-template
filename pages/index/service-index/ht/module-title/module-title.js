// pages/index/service-index/ht/module-title/module-title.js
Component({
  /**启用插槽 */
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题名
    title: {
      type: String,
      value: "标题"
    },
    // 字体大小，默认34rpx
    fontSize: {
      type: String,
      value: "34rpx"
    },
    // 字体颜色
    color: {
      type: String,
      value: "#242526"
    },
    // 加粗程度
    fontWeight: {
      type: String,
      value: "bold"
    },
    // 是否有标题后的信息，默认无
    isHaveRemark: {
      type: Boolean,
      value: false
    },
    // 标题后的信息
    remarkInfo: {
      type: String,
      value: ""
    },
    // 是否有查看更多按钮，默认有
    isHaveMoreBtn: {
      type: Boolean,
      value: true
    },
    // 查看更多按钮名字
    moreBtnName: {
      type: String,
      value: "查看更多"
    },
    // 查看更多的h5链接
    moreBtnUrl: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toH5PageFun: function() {
      let that = this;
      if (!that.data.moreBtnUrl) {
        wx.showToast({
          title: '无链接地址，无法查看更多',
          icon: "none",
          duration: 3000
        });
        return
      }
      console.log("查看更多的h5链接地址：" + that.data.moreBtnUrl);
      // wx.navigateTo({
      //   url: '',
      // });
    }
  }
})