
Page({
  data: {
    list: [
      {
        avatar: '../../../images/public/public_avatar.png',
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        price: '¥50.00',
        num: 'x3'
      },
      {
        avatar: '../../../images/public/public_avatar.png',
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        price: '¥50.00',
        num: 'x3'
      }
    ]
  },
  onReady: function () {
    this.tmcnavbar = this.selectComponent("#tmcnavbar");
  },
  onLoad: function () {
  }
})
