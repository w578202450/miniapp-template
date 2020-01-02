//app.js
import TIM from 'tim-wx-sdk'
import COS from "cos-wx-sdk-v5"
import { SDKAPPID } from './utils/GenerateTestUserSig'
const tim = TIM.create({
  SDKAppID: SDKAPPID
})
tim.setLogLevel(1)
tim.registerPlugin({ 'cos-wx-sdk': COS })
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log("===data===" + res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://10.0.0.23:6203/wx/getWXAuth',
          method:'POST',
          header: {
            'content-type': 'application/json'
          },
          dataType: 'json',
          data:{
            'code':res.code
          },
          success: function (res){
            // console.log("===success===" + res.data.data.openid)
            wx.request({
              url: 'http://10.0.0.23:6112/api/tmc/patient/getPatientInfoByOpenID',
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              dataType: 'json',
              data: {
                'openID': res.data.data.openid
              },
              success: function (res) {
                console.log("===success===" + JSON.stringify(res.data));
              },
              fail: function (res) {
                console.log("===fail===" + res)
              },
              complete: function (res) {
                console.log("===complete===" + res)
              },
            })
          },
          fail:function(res){
            console.log("===fail===" + res)
          },
          complete:function(res){
            console.log("===complete===" + res)
          },
        })
      }
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },
  tim: tim,
  TIM: TIM,
})