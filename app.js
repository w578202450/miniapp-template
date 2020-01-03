//app.js
import TIM from './utils/tim-wx'
// import COS from "cos-wx-sdk-v5"
import { SDKAPPID } from './utils/GenerateTestUserSig'
const AUTH = require('utils/auth')
const HTTP = require('utils/http-util')
const tim = TIM.create({
  SDKAppID: SDKAPPID
})
tim.setLogLevel(1)
// tim.registerPlugin({ 'cos-wx-sdk': COS })
App({
  onLaunch: function () {
    AUTH.wxlogin();
  },

  globalData: {
    userInfo: null
  },
  tim: tim,
  TIM: TIM,
})