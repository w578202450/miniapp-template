/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 11:24:55
 */

import { getWXAuth } from '../../http/api';

// 获取应用实例
const app = getApp();
Page({
  data: {
    showDialog: false,
    userInfo: {},
    test: 'test1',
    name: '2222',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse('open-data.type.userAvatarUrl') &&
      wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '/pages/logs/logs',
    })
  },
  onLoad() {
    getWXAuth().then(res => {
      console.log(res)
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    console.log(app.globalData.name)
    console.log(app.globalData.age)
  },
  handleClick () {
    this.data.test = 'test222'
    this.setData({test: 'test222'})
    // wx.navigateTo({
    //   url: '/pages/logs/index',
    // })
    
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: message('displayUserInfo'), // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      },
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  changeLanguage() {
    this.setData({ showDialog: true })
  },
  tapDialogButton() {
    this.setData({ showDialog: false })
  },
})
