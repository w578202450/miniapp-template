var WxParse = require('../../../../../components/wxParse/wxParse.js');
const HTTP = require('../../../../../utils/http-util');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentContent: "",
    commentDatas: [],
    isInput: false,
    disable: true, // 觉得有用按钮是否可以点击
    articleDatas: {},
    inquiryIcon: "/images/inquiry/inquiry_article_add.png",
    likeIcon: "/images/inquiry/inquiry_article_like.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("进入H5展示的参数：" + JSON.stringify(options));
    if (options.materialData) {
      this.articleDatas = JSON.parse(options.materialData);
      WxParse.wxParse('article', 'html', decodeURIComponent(this.articleDatas.content), this, 5);
      this.usefulStatusRequest();
      this.listCommentRequest();
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
          commentDatas: res.data.datas
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
        this.disable = res.data;
      }
    })
  },
  /**
   * 觉得有用
   */
  likeOption() {
    if (this.disable) {
      wx.showToast({
        title: '已经点赞过',
      })
      return;
    }
    wx.showLoading({
      title: '等待...',
    })
    HTTP.useful({
      "articleID": this.articleDatas.keyID,
      "patientID": app.globalData.patientID
    }).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        this.disable = true;
        wx.showToast({
          title: '点赞成功',
        })
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    }).catch(error => {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
      })
    });
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
      wx.showToast({
        title: '请先登录',
      })
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

  focusButn: function(event) {
  },

  publishAction() {
    if (this.data.commentContent.length === 0) {
      wx.showToast({
        title: '内容为空',
      })
      return;
    } 
    if (app.globalData.isInitInfo) {
      this.articleCommentPublishRequest(this.data.commentContent);
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
  },

  bindinput(event) {
    this.setData({
      cursor: event.detail.cursor,
      commentContent: event.detail.value
    })
  },
  /**
   * 发表评论请求
   */
  articleCommentPublishRequest(commentContent) {
    wx.showLoading({
      title: '发布中...',
    })
    HTTP.articleCommentPublish({
      "orgID": app.globalData.orgID,
      "articleID": this.articleDatas.keyID,
      "patientID": app.globalData.patientID,
      "patientName": app.globalData.userInfo.nickName,
      "patientFaceUrl": app.globalData.userInfo.avatarUrl,
      "commentContent": commentContent
    }).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        wx.showToast({
          title: '发表评论成功'
        })
        this.setData({
          isInput: false,
          commentContent: ""
        })
        this.listCommentRequest();
        
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    }).catch(error => {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
      })
    });
  }
})