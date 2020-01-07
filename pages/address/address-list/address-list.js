const app = getApp()

Page({
  data: {
    list: [
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: true
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
    ]
  },
  onLoad: function () {

  },

  addAction: function(){
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  defaultAddress:function(e){
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < this.data.list.length; i++) {
      if (i == index) {
        this.data.list[i].selected = true;
      } else {
        this.data.list[i].selected = false;
      }
    }
    this.setData({
      list: this.data.list
    });
  },

  editAction:function(){
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  deleteAction:function(){
    wx.showModal({
      content: '确定删除当前地址？'
    })
  }
})