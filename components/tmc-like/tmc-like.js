const HTTP = require('../../utils/http-util');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 自定义样式
    style: {
      type: String,
      value: "height: 56rpx"
    },
    // 是否可以点击
    disable: {
      type: Boolean,
      value: true
    },
    // 点赞对象keyID
    keyID: {
      type: String,
      value: ""
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    likeIcon: "/images/inquiry/inquiry_article_like.png",
    likeIcon_disable: "/images/inquiry/inquiry_article_like_disable.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 觉得有用
     */
    tapAction() {
      if (this.data.disable) {
        wx.showToast({
          title: '已经点赞过',
          icon: "none"
        })
        return;
      } else {
        if (app.globalData.isInitInfo) {
          this.likeRequest();
        } else {
          this.triggerEvent('login')
        }
      }
    },

    likeRequest(){
      wx.showLoading({
        title: '等待...',
      })
      HTTP.useful({
        "articleID": this.data.keyID,
        "patientID": app.globalData.patientID
      }).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          this.disable = true;
          wx.showToast({
            icon: "none",
            title: '您的一分肯定，是我们前进的动力',
            duration: 3000
          })
          this.setData({
            disable: true
          })
          this.triggerEvent('success')
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 3000
          })
        }
      }).catch(error => {
        wx.hideLoading();
        wx.showToast({
          title: "网络连接失败",
          icon: "none",
          duration: 3000
        })
      });
    }
  }
})