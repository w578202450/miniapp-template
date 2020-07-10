// components/tab-bar/tab-bar.js
const app = getApp();
import { requestMsgFun } from '../../utils/common.js';
import HTTP from '../../utils/http-util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    secIndex: {
      type: Number,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar: app.globalData.tabbar
  },

  attached: function () {
    // 在组件实例进入页面节点树时执行
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialogCom");
    this.couponRefs = this.selectComponent("#coupon");
    console.log('isShowCoupon:',app.globalData.isShowCoupon)
    app.watch((value) => {
      // value为app.js中传入的值
      this.sendCoupon()
  }, "isShowCoupon"); 
  },

  /**
   * 组件的方法列表
   */
  methods: {
      /** 发放优惠券 */
    sendCoupon: function(){
      let params = {
        orgID: app.globalData.orgID,
        patientID: app.globalData.patientID
      }
      HTTP.sendCoupon(params).then(res=>{
        if(res.data&&res.data.length){
          this.couponRefs.showCouponDialog()
        }
      })
    },
    selectedTabFun: function(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      app.globalData.tabbar.list.forEach((item, ind) => {
        item.selected = false;
        if (index == ind) {
          item.selected = true;
        }
      });
      console.log(app.globalData.isInitInfo);
      if (index == 1) {
        if (app.globalData.isInitInfo == "ready") {
          requestMsgFun(); // 获取服务通知授权，跳转问诊聊天
        } else {
          // wx.switchTab({
          //   url: that.data.tabbar.list[index].pagePath
          // });
          let nextPageName = "chat";
          console.log(nextPageName)
          this.popup.showPopup(nextPageName); // 显示登录确认框
        }
      } else {
        wx.switchTab({
          url: that.data.tabbar.list[index].pagePath
        });
      }
    },
    /**取消事件 */
    _error() {
      this.popup.hidePopup();
    },

    /**确认事件 */
    _success() {
      this.popup.hidePopup();
    }
  }
})
