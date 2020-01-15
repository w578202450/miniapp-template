const HTTP = require('../../../utils/http-util')
/**
 * delta==2 订单列表跳转
 * delta==3 聊天页面跳转
 */
Page({
  data: {
    addressInfo:null,
    orderID:'',
    modifyUser:'',
    delta:0
  },
  
  onLoad: function (e) {
    if (e.delta){
      this.data.delta = e.delta
    }
    if (e.orderID){
      this.data.orderID = e.orderID
    }
    if (e.modifyUser){
      this.data.modifyUser = e.modifyUser
    }
    if (e.addressInfo){
      this.data.addressInfo = JSON.parse(e.addressInfo)
      this.setData({
        addressInfo: this.data.addressInfo
      })
    }
  },
  /**
   * 备注
   */
  remarksInput(e){
    this.data.addressInfo.remarks = e.detail.value;
  },
  /**
   * 设置订单配送地址
   */
  submitOption(){
    wx.showLoading({
      title: '确认收货地址...',
    });
    HTTP.fillDeliveryAddr({
      "orgID": wx.getStorageSync('orgID'),
      "orderID": this.data.orderID,
      "receiverName": this.data.addressInfo.receiverName,
      "receiverPhone": this.data.addressInfo.receiverPhone,
      "province": this.data.addressInfo.province,
      "city": this.data.addressInfo.city,
      "area": this.data.addressInfo.area,
      "address": this.data.addressInfo.address,
      "remarks": this.data.addressInfo.remarks,
      "modifyUser": this.data.modifyUser
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '地址绑定完成',
            success:function(){
              // 返回到指定界面  delta==2 返回订单列表 delta==3 返回聊天页面
              wx.navigateBack({
                delta: this.data.delta
              })
            }
          })
        }

      }).catch(e => {
        wx.hideLoading();
      })
  }
})
