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
      console.log("点击取消");
    },

    _success() {
      this.hidePopup();
      this.triggerEvent("success");
      console.log("点击确定");
    },

    /** 
     * 操作：微信自带弹窗授权获取手机号(拒绝和允许) 
     */
    getPhoneNumber(e) {
      console.log("e:" + JSON.stringify(e));
      let sessionKey = wx.getStorageSync("sessionKey");
      console.log(app.globalData)
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
           console.log("checkSession有效");
           HTTP.decryptionPhone(prams).then(res => {
             console.log("------授权获取手机号-------" + "传参：" + JSON.stringify(prams) + "    返回结果:" + JSON.stringify(res));
             if (res) {
               console.log("解密成功");
               app.globalData.userInfo.phone = res.data || '';
               wx.setStorageSync('userInfo', app.globalData.userInfo);
               let mergeParam={
                patientID:app.globalData.patientID,
                phone:res.data,
                orgID:app.globalData.orgID,
                assistantStaffID:wx.getStorageSync('shareAssistantStaffID')
               }
               HTTP.autoMerge(mergeParam).then(res => {}).catch(res=>{

               })
             }
             // 获取手机号允许回调
             this.triggerEvent("success");

           }).catch(res => {
             console.log("解密失败");
             wx.showToast({
               title: "授权失败，请重新登陆",
               icon: 'none',
               duration: 2000
             })
             this.triggerEvent("fail");
           })
         },
         fail: () => {
           console.log("checkSession无效");
           //app.globalData.hasLogin = false;
           wx.showToast({
             title: "授权失败，请重新登陆",
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