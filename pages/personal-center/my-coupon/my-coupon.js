// pages/personal-center/my-coupon/my-coupon.js
const HTTP = require('../../../utils/http-util')
import { requestMsgFun } from '../../../utils/common';
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     couponListL:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = {
      orgID: app.globalData.orgID,
      patientID: app.globalData.patientID
    }
    HTTP.queryPatientCouponList(params).then(res=>{
       if(res.data&&res.data.length){
          res.data.forEach(item=>{
            item.rule = JSON.parse(item.rule)
          })
          this.setData({
            couponListL:res.data
          })
       }
    })
  },
  use(){
    requestMsgFun()
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

  }
})