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
      value: "32rpx"
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
    // 是否有标题下的底部线条
    isHaveBorderBottom: {
      type: Boolean,
      value: true
    },
    // 是否有标题后的信息，默认无
    isHaveRemark: {
      type: Boolean,
      value: true
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
    // 查看更多请求列表数据所需要的参数
    httpParams: {
      type: Object,
      value: {
        nextPage: "" // 要跳转的页面的路径
      }
    },
    // 是否标题下有小标题
    isHaveLittleTitle: {
      type: Boolean,
      value: false
    },
    // 小标题内容
    littleTitle: {
      type: String,
      value: ""
    },

    effect: {
      type: String,
      value: ""
    },

    serve: {
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
    /**操作：查看更多 */
    toListPageFun: function() {
      let that = this;
      if (!that.data.httpParams || !that.data.httpParams.nextPage) {
        wx.showToast({
          title: '未传递参数，无法查看更多',
          icon: "none",
          duration: 3000
        });
        return
      }
      console.log("传递的参数：" + JSON.stringify(that.data.httpParams));
      let params = JSON.stringify(that.data.httpParams);
      wx.navigateTo({
        url: that.data.httpParams.nextPage + "?httpParams=" + params
      });
    }
  }
})