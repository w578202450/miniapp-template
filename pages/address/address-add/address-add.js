Page({
  data: {
  },
  onLoad: function () {
  },

  data: {
    region: ['四川省', '成都市', '锦江区'],
    customItem: '全部'
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})