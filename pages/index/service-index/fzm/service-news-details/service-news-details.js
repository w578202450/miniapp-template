var WxParse = require('../../../../../components/wxParse/wxParse.js');
const HTTP = require('../../../../../utils/http-util');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newComment: "", // 评论输入框内容
    isInput: false, // 输入框是否处于输入状态
    usefulBtnDisable: false, // 觉得有用按钮是否可以点击
    articleDatas: {}, // 文章详情
    inquiryIcon: "/images/inquiry/inquiry_article_add.png",
    likeIcon: "/images/inquiry/inquiry_article_like.png",
    likeIcon_disable: "/images/inquiry/inquiry_article_like_disable.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("进入H5展示的参数：" + JSON.stringify(options));
    this.articleDatas = JSON.parse(options.materialData);
    this.getArticleByKeyID();
    this.usefulStatusRequest();
    this.listCommentRequest();
    // articleType
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getArticleByKeyID() {
    HTTP.getArticleByKeyID({
      "keyID": this.articleDatas.keyID,
    }).then(res => {
      if (res.code == 0 && res.data) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        if (res.data.articleType === 0) {
          WxParse.wxParse('article', 'html', res.data.content, this, 20);
        }
        this.setData({
          articleData: res.data
        })


      }
    })
  },
  /**
   * 文章评论列表
   */
  listCommentRequest() {
    HTTP.listComment({
      "articleID": this.articleDatas.keyID,
      "pageSize": 100,
      "pageIndex": 1
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          commentList: res.data.datas
        })
      }
    })
  },
  /**
   * 觉得有用按钮状态
   */
  usefulStatusRequest() {
    HTTP.usefulStatus({
      "articleID": this.articleDatas.keyID,
      "patientID": app.globalData.patientID
    }).then(res => {
      if (res.code === 0) {
        this.usefulBtnDisable = res.data;
        this.setData({
          usefulBtnDisable: res.data
        })
      }
    })
  },
  /**
   * 觉得有用
   */
  likeOption() {
    if (this.usefulBtnDisable) {
      wx.showToast({
        title: '已经点赞过',
        icon: "none"
      })
      return;
    } else {
      if (app.globalData.isInitInfo) {
        wx.showLoading({
          title: '等待...',
        })
        HTTP.useful({
          "articleID": this.articleDatas.keyID,
          "patientID": app.globalData.patientID
        }).then(res => {
          wx.hideLoading();
          if (res.code === 0) {
            this.usefulBtnDisable = true;
            wx.showToast({
              icon: "none",
              title: '您的一分肯定，是我们前进的动力',
              duration: 3000
            })
            this.setData({
              usefulBtnDisable: true
            })
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
      } else {
        this.popup.showPopup(""); // 显示登录确认框
      }
    }

  },
  /**
   * 操作：开始问诊
   * 1.已登录，直接到问诊页
   * 2.未登录，授权登录
   *  */
  toOnlineInqueryFun: function() {
    if (app.globalData.isInitInfo) {
      wx.navigateTo({
        url: '/pages/online-inquiry/inquiry/chat/chat'
      });
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  },
  /**
   * 发表评论
   */
  inputoption() {
    this.setData({
      isInput: true
    })
  },

  inputFocus(e) {
    console.log(e, '键盘弹起')
    this.setData({
      isInput: true
    })
  },
  inputBlur() {
    console.log('键盘收起')
    this.setData({
      isInput: false
    })
  },

  focusButn: function(event) {},

  publishAction() {
    if (this.data.newComment.length === 0) {
      wx.showToast({
        title: '内容为空',
        icon: 'none'
      })
      return;
    }
    if (app.globalData.isInitInfo) {
      this.articleCommentPublishRequest(this.data.newComment);
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  },

  bindinput(event) {
    this.setData({
      cursor: event.detail.cursor,
      newComment: event.detail.value
    })
  },
  /**
   * 发表评论请求
   */
  articleCommentPublishRequest(newComment) {
    wx.showLoading({
      title: '发布中...',
    })
    HTTP.articleCommentPublish({
      "orgID": app.globalData.orgID,
      "articleID": this.articleDatas.keyID,
      "patientID": app.globalData.patientID,
      "patientName": app.globalData.userInfo.nickName,
      "patientFaceUrl": app.globalData.userInfo.avatarUrl,
      "commentContent": newComment
    }).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        wx.showToast({
          title: '发表评论成功'
        })
        this.setData({
          isInput: false,
          newComment: ""
        })
        this.listCommentRequest();

      } else {
        wx.showToast({
          title: res.message,
          icon: none
        })
      }
    }).catch(error => {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
      })
    });
  },
  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  }
})