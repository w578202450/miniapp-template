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
     * 是否正在输入评论
     */
    isInputting: {
      type: Boolean,
      value: false
    },
    /**
     * 评论列表 所持有公共参数
     * systemCode 系统模块tmc
     * bizCode 类型article
     * objectID 对像id
     */
    queryParams: {
      type: Object,
      value: {},
      observer: function(value) {
        this.queryCommentList(value);
      }
    },
    /**
     * 发表 所持有公共参数
     * systemCode 系统code 如tmc
     * bizCode 业务code 如article
     * orgID 机构
     * deptID 部门 
     * userID 作者
     * objectID 评论对象id
     * commentUserID 评论人id
     * commentUserName 评论人姓名
     * commentUserFace 评论人头像
     * commentContent 评论内容
     */
    publishParams: {
      type: Object,
      value: {
        systemCode: "",
        bizCode:"",
        deptID:"",
        userID:"",
        objectID:""
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 评论列表
     */
    commentList: [],
    comment: "", // 评论内容
    textareaHeight: 0, // 键盘输入框高度 
    cursor: 0, // 当前输入数
    pageInfo:{
      pageSize: 10,
      pageIndex: 1
    },
    tipInfo: {},
    defaultPhotoUrl: "/images/chat/personBacImg.png"
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
      });
    },
    /**
     * 键盘弹起
     */
    inputFocus(e) {
      this.setData({
        isInputting: true,
        textareaHeight: e.detail.height
      });
    },
    /**
     * 键盘收起
     */
    inputBlur() {
      this.setData({
        isInputting: false
      });
    },
    /**
     * 点击发布按钮
     */
    publishAction() {

      if (app.globalData.isInitInfo) {
        if (this.data.comment.length === 0) {
          wx.showToast({
            title: '请填写评论内容',
            icon: 'none'
          })
          return;
        }
        this.publishRequest(this.data.comment);
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
     * 查询评论列表
     */
    queryCommentList(queryParams) {
      if (!queryParams || Object.keys(queryParams).length === 0) {
        return;
      }
      let params = {
        ...this.data.pageInfo,
        ...queryParams
      };

      HTTP.queryCommentList(params).then(res => {
        if (res.code === 0 && res.data.datas) {
          this.setData({
            commentList: this.data.commentList.concat(res.data.datas),
            pageInfo: res.data.pageInfo,
            pageDatas: res.data.datas,
            tipInfo: {
              noData: "暂无评论", // 数据为空的情况
              moreData: "点击加载更多", // 可以点击 加载更多 进行分页请求
              noMoreData: "已经到底了" // 没有更多数据 当前页数据不够一页
            }
          })
        }
      });
    },
    /**
     * 发表评论请求
     */
    publishRequest(comment) {
      wx.showLoading({
        title: '发布中...',
      })
      HTTP.publishComment({
        orgID: wx.getStorageSync("shareOrgID"),
        commentUserID: app.globalData.patientID,
        commentUserName: app.globalData.userInfo.nickName,
        commentUserFace: app.globalData.userInfo.avatarUrl,
        commentContent: comment,
        ...this.data.publishParams
      }).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          wx.showToast({
            title: '发表评论成功'
          })
          this.setData({
            isInputting: false,
            comment: "",
            cursor: 0
          });
          // 外部方法
          this.triggerEvent('publishSuccess');
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
    // 评论加载更多数据
    loadMoreData() {
      this.data.pageInfo.pageIndex += 1;
      this.queryCommentList(this.data.queryParams);
    }
  },

  
  
})