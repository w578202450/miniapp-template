const HTTP = require('../../../utils/http-util');
const Common = require('../../../common/common');
const commonFun = require('../../../utils/common');

let app = getApp()

Page({
  data: {
    addressInfo: null,
    orderID: '',
    modifyUser: ''
  },

  onLoad: function(e) {
    console.log('e--------', e)
    console.log('e.orderID--------', e.orderID)
    if (e.orderID) {
      this.data.orderID = e.orderID
    }
    if (e.modifyUser) {
      this.data.modifyUser = e.modifyUser
    }
    if (e.addressInfo) {
      this.data.addressInfo = JSON.parse(e.addressInfo)
      this.setData({
        addressInfo: this.data.addressInfo
      })
    } else {
      this.fetchDefaultAddress()
    }
  },

  /**
   * 获取默认地址
   */
  fetchDefaultAddress() {
    wx.showNavigationBarLoading()
    if (!app.globalData.personID) {
      wx.showToast({
        title: 'personID为空',
        icon: 'none'
      })
      return;
    }
    HTTP.getAddress({
        personID: app.globalData.personID
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          if (res.data) {
            for (var index in res.data) {
              let item = res.data[index]
              if (item.isDefault == 1) {
                this.data.addressInfo = {
                  name: item.receiverName,
                  phone: item.receiverPhone,
                  address: item.address,
                  province: item.province,
                  city: item.city,
                  area: item.area,
                  remarks: item.remarks ? item.remarks : '',
                  isDefault: item.isDefault
                } //将想要传的信息赋值给上一个页面data中的值
                break;
              }
            }

            this.setData({
              addressInfo: this.data.addressInfo
            })
          }

          this.data.list = res.data
          this.setData({
            list: res.data,
            noNetwork: false
          })
        } else {
          this.setData({
            noNetwork: false
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      }).catch(e => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        this.setData({
          noNetwork: true
        })
      })
  },
  /**
   * 备注
   */
  remarksInput(e) {
    let value = Common.filterEmoji(e.detail.value)
    this.data.addressInfo.remarks = value;
    return {
      value: value
    }
  },
  /**
   * 设置订单配送地址
   */
  submitOption() {
    console.log('submitOption=====', this.data.addressInfo)
    let that = this
    if (!this.data.addressInfo || !this.data.addressInfo.name || !this.data.addressInfo.phone || !this.data.addressInfo.province || !this.data.addressInfo.city || !this.data.addressInfo.area || !this.data.addressInfo.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '确认收货地址...',
    });
    HTTP.fillDeliveryAddr({
        orgID: app.globalData.orgID,
        orderID: this.data.orderID,
        receiverName: this.data.addressInfo.name,
        receiverPhone: this.data.addressInfo.phone,
        province: this.data.addressInfo.province,
        city: this.data.addressInfo.city,
        area: this.data.addressInfo.area,
        address: this.data.addressInfo.address,
        remarks: this.data.addressInfo.remarks ? this.data.addressInfo.remarks : '',
        modifyUser: this.data.modifyUser
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '地址绑定完成',
            success: function() {
              let _data = {
                orgID: app.globalData.orgID,
                keyID: app.globalData.patientID,
                province: that.data.addressInfo.province,
                city: that.data.addressInfo.city,
                area: that.data.addressInfo.area,
                address: that.data.addressInfo.address,
              }
              HTTP.asyncPatientAddress(_data)
              that.navigateBack()
            }
          })
        }

      }).catch(e => {
        wx.hideLoading();
      })
  },
  /**
   * 返回
   */
  navigateBack() {
    let currentPage = null; //当前页面
    let prevPage = null; //上一个页面
    let pages = getCurrentPages();
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.loadDatas()
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  }

})