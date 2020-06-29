const app = getApp();
import HTTP from '../../utils/http-util'

Component({
  /** 
   * 组件的属性列表 
   */
  properties: {
    /** 
     * 是否隐藏弹出框 
     */
    isHiddenDialog: {
      type: Boolean,
      value: true
    },
    /** 
     * type 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） 
     * value 属性初始值（可选），如果未指定则会根据类型选择一个 
     */
    title: {
      type: String,
      value: '微信授权'
    },
    // 弹窗内容 
    content: {
      type: String,
      value: '微信授权成功'
    },
    // 弹窗取消按钮文字 
    btn_no: {
      type: String,
      value: '拒绝'
    },
    // 弹窗确认按钮文字 
    btn_ok: {
      type: String,
      value: '允许'
    }
  },

  /** 
   * 组件的初始数据 
   */
  data: {
    isHiddenDialog: true, // 是否隐藏 
    content_image: "/images/mine/phone_allow.png",
    nextPageName: "" // 登录后需要跳转的下一级页面的名字 
  },

  /** 
   * 组件的方法列表 
   */
  methods: {
    //隐藏弹框 
    hidePopup: function () {
      this.setData({
        isHiddenDialog: true
      });
    },

    //展示弹框 
    showPopup(nextPageName) {
      this.setData({
        isHiddenDialog: false,
        nextPageName: nextPageName ? nextPageName : ""
      });
    },

    /* 
     * 内部私有方法建议以下划线开头 
     * triggerEvent 用于触发事件 
     */
    _error() {
      this.hidePopup();
      this.triggerEvent("error");
    },

    _success() {
      this.hidePopup();
      this.triggerEvent("success");
    },

    /** 
     * 操作：微信自带弹窗授权获取手机号(拒绝和允许) 
     */
    getPhoneNumber(e) {
      console.log('====')
      console.log(app.globalData.phoneDialogNextPage)
      let sessionKey = wx.getStorageSync("sessionKey");
      let prams = {
        personID: app.globalData.patientID,
        encryptedData: e.detail.encryptedData,
        sessionkey: sessionKey,
        iv: e.detail.iv
      };

      if (e.detail.errMsg == "getPhoneNumber:ok") { // 点击允许 
      // 检查登录态
       wx.checkSession({
         success: () => {
           HTTP.decryptionPhone(prams).then(res => {
             if (res) {
               app.globalData.userInfo.phone = res.data || '';
               wx.setStorageSync('userInfo', app.globalData.userInfo);
               let mergeParam={
                patientID:app.globalData.patientID,
                phone:res.data,
                orgID:app.globalData.orgID,
                assistantStaffID:wx.getStorageSync('shareAssistantStaffID')
               }
               HTTP.autoMerge(mergeParam).then(res => {}).catch(res=>{})
             }
             // 获取手机号允许回调
             this.triggerEvent("success");
             if(app.globalData.phoneDialogNextPage=='chat'){
               wx.navigateTo({
                  url: '/pages/online-inquiry/inquiry/chat/chat',
                });
             }
           }).catch(res => {
             wx.showToast({
               title: "授权失败，请重新登录",
               icon: 'none',
               duration: 2000
             })
             this.triggerEvent("fail");
           })
         },
         fail: () => {
           //app.globalData.hasLogin = false;
           wx.showToast({
             title: "授权失败，请重新登录",
             icon: 'none',
             duration: 2000
           })
         }
       })
      } else { // 点击拒绝 
        wx.showToast({
          title: "请允许授权使用手机号",
          icon: 'none',
          duration: 2000
        })
        this.triggerEvent("fail");
      }
    }
  }
})