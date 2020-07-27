// components/address/edit/edit.js
const app = getApp()
const HTTP = require('../../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object,
      value: {}
    },
    inquiryID:{
      type:String,
      value:""
    }
  },
  attached() {
    this.loadDatas()
    console.log(this.data.orderInfo, 2222222222)
  },
  /**
   * 组件的初始数据
   */
  data: {
    timer: null,
    pageName: '收货地址页',
    list: [],
    optionType: 0
  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取地址列表
     */
    loadDatas() {
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
            this.data.list = res.data
            res.data.forEach(item => {
              item.isDefault = 0
            })
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
    addAddress() {
      let orderID = this.data.orderInfo.orderID;
      let orgID = this.data.orderInfo.orgID;
      wx.navigateTo({
        url: '/pages/address/address-add/address-add?count=1&orgin=chat&orgID=' + orgID + '&orderID=' + orderID,
      })
    },
    close() {
      this.triggerEvent("closeEditAddress")
    },
    selectedAddress(event) {
      wx.showLoading({
        title: '地址修改中',
      })
      let index = event.currentTarget.dataset.index
      let arr = []
      this.data.list.forEach((item, i) => {
        let ele = JSON.parse(JSON.stringify(item))
        if (index === i) {
          ele.isDefault = 1
        } else {
          ele.isDefault = 0
        }
        arr.push(ele)
      })
      this.setData({
        list: arr
      })
      let _data = {
        orgID: this.data.orderInfo.orgID,
        orderID: this.data.orderInfo.orderID,
        receiverName: this.data.list[index].receiverName,
        receiverPhone: this.data.list[index].receiverPhone,
        province: this.data.list[index].province,
        city: this.data.list[index].city,
        area: this.data.list[index].area,
        address: this.data.list[index].address,
        inquiryID:this.data.inquiryID
      }
      HTTP.updateOrderDelivery(_data).then(res => {
        setTimeout(()=>{
          wx.hideLoading()
        },500)
        if (res.code==0) {
          wx.showToast({
            title: '地址修改成功'
          })
          this.close()
        }else{
          wx.showToast({
            title: '地址修改失败'
          })
        }
      }).catch(err=>{
        wx.hideLoading()
      })
    }
  }
})