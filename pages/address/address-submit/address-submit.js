const HTTP = require('../../../utils/http-util')

Page({
  data: {
    addressInfo:null,
    orderID:'',
    modifyUser:''
  },
  
  onLoad: function (e) {
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
    let that = this
    wx.showLoading({
      title: '确认收货地址...',
    });
    HTTP.fillDeliveryAddr({
      orgID: wx.getStorageSync('orgID'),
      orderID: this.data.orderID,
      receiverName: this.data.addressInfo.receiverName,
      receiverPhone: this.data.addressInfo.receiverPhone,
      province: this.data.addressInfo.province,
      city: this.data.addressInfo.city,
      area: this.data.addressInfo.area,
      address: this.data.addressInfo.address,
      remarks: this.data.addressInfo.remarks,
      modifyUser: this.data.modifyUser
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '地址绑定完成',
            success:function(){
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
    let currentPage = null;   //当前页面
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
  }

})
