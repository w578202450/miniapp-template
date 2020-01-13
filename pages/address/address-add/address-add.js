Page({
  data: {
    edit:false,
    receiverName:'',
    receiverPhone:'',
    address:''
  },
  onLoad: function (e) {
    this.data.edit = e.edit==1 ? true : false
  },

  data: {
    region: ['四川省', '成都市', '锦江区'],
    customItem: '全部'
  },

  bindRegionChange: function (e) {
    console.log('bindRegionChange--------',e)
    this.setData({
      region: e.detail.value
    })
  },

  receiverNameInput(e){
    this.data.receiverName = e.detail.value;
  },

  receiverPhoneInput(e){
    this.data.receiverPhone = e.detail.value
  },

  addressInput(e){
    this.data.address = e.detail.value
  }
})