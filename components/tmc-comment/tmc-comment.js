
const HTTP = require('../../utils/http-util');
const Common = require('../../common/common')
const app = getApp()
/**
 * 外部方法:
 * publishSuccess 发布成功回调
 * login 发布前需要登录 
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 评论列表
     */
    commentList:{
      type: Object,
      value: {}
    },
    /**
     * 是否正在输入评论
     */
    isInputting: {
      type: Boolean,
      value: false
    },
    /**
     * 评论对象id
     */
    keyID: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment: "", // 评论内容
    textareaHeight: 0 // 键盘输入框高度 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击底部评论输入界面
     */
    inputoption() {
      this.setData({
        isInputting: true
      })
    },
    /**
     * 键盘弹起
     */
    inputFocus(e) {
      console.log(e, '键盘弹起', e.detail.height)
      this.setData({
        isInputting: true,
        textareaHeight: e.detail.height
      })
    },
    /**
     * 键盘收起
     */
    inputBlur() {
      console.log('键盘收起')
      this.setData({
        isInputting: false
      })
    },
    /**
     * 点击发布按钮
     */
    publishAction() {

      if (app.globalData.isInitInfo) {
        if (this.data.comment.length === 0) {
          wx.showToast({
            title: '内容为空',
            icon: 'none'
          })
          return;
        }
        this.articleCommentPublishRequest(this.data.comment);
      } else {
        this.triggerEvent('login')
      }
    },

    bindinput(event) {
      let value = Common.filterEmoji(event.detail.value)
      this.setData({
        cursor: event.detail.cursor,
        comment: value
      })
      return {
        value: value
      }
      
    },

    /**
   * 发表评论请求
   */
    articleCommentPublishRequest(comment) {
      wx.showLoading({
        title: '发布中...',
      })
      HTTP.articleCommentPublish({
        "orgID": app.globalData.orgID,
        "articleID": this.data.keyID,
        "patientID": app.globalData.patientID,
        "patientName": app.globalData.userInfo.nickName,
        "patientFaceUrl": app.globalData.userInfo.avatarUrl,
        "commentContent": comment
      }).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          wx.showToast({
            title: '发表评论成功'
          })
          this.setData({
            isInputting: false,
            comment: ""
          })
          this.triggerEvent('publishSuccess')
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      }).catch(error => {
        wx.hideLoading();
        wx.showToast({
          title: '网络连接失败',
          icon: "none"
        })
      });
    },
  }
})