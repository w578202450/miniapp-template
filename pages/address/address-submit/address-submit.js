
Page({
  data: {
    addressInfo:null
  },

  submitAction: function () {
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  onLoad: function (e) {
    console.log('e---', e)
    console.log('e.name---', e.name)
    console.log('e.phone---', e.phone)
    console.log('e.address---', e.address)
    if (e.name && e.phone && e.address){
      this.data.addressInfo = {
        name: e.name,
        phone: e.phone,
        address: e.address
      }
      this.setData({
        addressInfo: this.data.addressInfo
      })
    }
  }
})
