const app = getApp();
import { onShareAppMessageFun } from '../../utils/common.js';
import { heartFun,intervalTime } from '../../utils/heart.js';
const HTTP = require('../../utils/http-util');
Page({
  data: {
    couponData:{rule:{}},
    timer:null,
    pageName:'我的页',
    list: [{
        url: 'health-information/health-information',
        title: '我的健康信息'
      },
      {
        url: '/pages/order/drug-orders/drug-orders',
        title: '药品订单'
      },
      {
        url: 'prescription/prescription',
        title: '我的处方'
      },
      {
        url: "/pages/address/address-list/address-list?optionType=0",
        title: '收货地址'
      },
      {
        url: "/pages/personal-center/my-coupon/my-coupon",
        title: '我的优惠券'
      }
    ],
    isSearchState: false, // 是否查询了一次
    isSelfLogin: false // 是否主动登录
  },

  onLoad: function(e) {
    app.hideTabBarFun();
    let that = this;
    if (app.globalData.isInitInfo) {
      that.getUserInfoByStorge(); // 获取用户授权信息
    } else {
      // 监听isInitInfo值的变化
      app.watch((value) => {
        // value为app.js中传入的值
        console.log("授权登录后是否已成功获取用户授权信息：", value);
        if (value) {
          that.data.isSelfLogin = true;
          that.getUserInfoByStorge();
        }
      }, "isInitInfo");
    }
    this.couponRefs = this.selectComponent("#coupon");
    app.watch((value) => {
      // value为app.js中传入的值
      console.log('isShowCoupon22222:',app.globalData.isShowCoupon)
      this.sendCoupon()
  }, "isShowCoupon"); 
  },

  onShow: function(e) {
    app.hideTabBarFun();
    let that = this;
    if (that.data.isSearchState) {
      that.setData({
        userInfo: app.globalData.userInfo ? app.globalData.userInfo : {}
      });
      console.log("获取用户缓存授权信息成功：" + JSON.stringify(that.data.userInfo));
    } else {
      console.log(app.globalData.isInitInfo);
    }
    this.timer=setInterval(() => {
      heartFun(this.data.pageName,this.__route__)
    }, intervalTime);
  },
    /** 发放优惠券 */
    sendCoupon: function(){
      let params = {
        orgID: app.globalData.orgID,
        patientID: app.globalData.patientID
      }
    
      HTTP.sendCoupon(params).then(res=>{
        if(res.data&&res.data.length){
            this.couponRefs.showCouponDialog()
            this.setData({
              couponData:res.data[0]
            })
        }
      })
    },
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

   /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.timer)
  },

  
  /**
   * 右上角分享功能
   */
  onShareAppMessage: function(res) {
    return onShareAppMessageFun();
  },

  /**显示登录确认框 */
  showPopup() {
    wx.hideLoading();
    wx.hideToast();
    this.popup.showPopup();
  },

  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  },

  /**获取用户缓存信息 */
  getUserInfoByStorge: function() {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log("获取用户缓存授权信息成功" + JSON.stringify(res));
        that.setData({
          userInfo: res.data
        });
        if (that.data.isSelfLogin) {
          wx.showToast({
            title: '登录成功',
            icon: "none",
            // duration: 2000
          });
        }
      },
      fail: function(res) {
        console.log("获取用户缓存授权信息失败");
      },
      complete: function(e) {
        that.setData({
          isSearchState: true
        });
      }
    });
  },

  /**
   * 操作：跳转到功能栏对应页面
   * 1.未登录，授权登录
   * 2.已登录，跳转页面
   */
  toToolFun: function(e) {
    let that = this;
    if (that.data.userInfo && that.data.userInfo.nickName) {
      let url = e.currentTarget.dataset.toolurl;
      wx.navigateTo({
        url: url,
      });
    } else {
      wx.showToast({
        title: '若要使用该功能，请先进行登录',
        icon: "none",
        duration: 3000
      });
    }
  }
})