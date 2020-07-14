// pages/personal-center/my-coupon/my-coupon.js
const HTTP = require('../../../utils/http-util')
import { requestMsgFun, onShareAppMessageFun } from '../../../utils/common';
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     couponListL:[],
     buttonClicked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.initData()
  },
  use(){
    requestMsgFun()
    //防止多次点击
    this.setData({
      buttonClicked:false
    })
    setTimeout(()=>{
      this.setData({
        buttonClicked:true
      })
    },1500)
  },
  initData(){
    wx.showLoading({
      title: '拼命加载中...',
    })
    let params = {
      orgID: app.globalData.orgID,
      patientID: app.globalData.patientID
    }
    HTTP.queryPatientCouponList(params).then(res=>{
        setTimeout(()=>{
          wx.hideLoading()
        },1000)
       if(res.data&&res.data.length){
          res.data.forEach(item=>{
            item.rule = JSON.parse(item.rule)
            item.startTime = item.startTime.slice(0,item.startTime.length-2)
            item.endTime = item.endTime.slice(0,item.endTime.length-2)
          })
          this.setData({
            couponListL:res.data
          })
       }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData()
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return  onShareAppMessageFun('/pages/index/home-index/home-index');
  }
})