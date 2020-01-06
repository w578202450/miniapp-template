//app.js
// 引入腾讯云IM
import TIM from './miniprogram_npm/tim-wx-sdk/index.js'
import COS from './miniprogram_npm/cos-wx-sdk-v5/index.js'
import { SDKAPPID } from './utils/GenerateTestUserSig'
// const AUTH = require('utils/auth')
const HTTP = require('utils/http-util')
const tim = TIM.create({
  SDKAppID: SDKAPPID
})
tim.setLogLevel(1)
tim.registerPlugin({ 'cos-wx-sdk': COS })
App({
  onLaunch: function () {
    // AUTH.wxlogin();
  },

  globalData: {
    userInfo: null
  },
  tim: tim,
  TIM: TIM
})

