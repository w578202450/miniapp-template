const app = getApp()

Page({
  data: {
    tipShow:true,//是否展示tip提示
    payShow:true,//是否展示支付界面
    list: [
      {
        name: '舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸舒筋健腰丸',
        unit: '250ml*10支/盒',
        num:'x3',
        methods:'用法用量：25ml/次，3次/日，口服，3天'
      },
      {
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        num: 'x3',
        methods: '用法用量：25ml/次，3次/日，口服，3天'
      },
      {
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        num: 'x3',
        methods: '用法用量：25ml/次，3次/日，口服，3天'
      },
      {
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        num: 'x3',
        methods: '用法用量：25ml/次，3次/日，口服，3天'
      },
      {
        name: '舒筋健腰丸',
        unit: '250ml*10支/盒',
        num: 'x3000',
        methods: '用法用量：25ml/次，3次/日，口服，3天'
      }
    ]
  },
  payAction:function(){
    wx.navigateTo({
      url: '/pages/address/address-submit/address-submit',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function () {

  }
})