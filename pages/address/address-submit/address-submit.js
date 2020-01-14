
Page({
  data: {
    addressInfo:null
  },
  
  onLoad: function (e) {
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
  
  submitOption(){

  }
})
