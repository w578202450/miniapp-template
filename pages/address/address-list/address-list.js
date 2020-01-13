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

  selectedAddress:function(e){
    var index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();      //获取所有页面
    let currentPage = null;   //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    } 
    if (prevPage) {
      prevPage.setData({
        addressInfo: {
          name: this.data.list[index].name,
          phone: this.data.list[index].phone,
          address: this.data.list[index].address
        }                 //将想要传的信息赋值给上一个页面data中的值
      })
    }
    wx.navigateBack({
      delta: 1,
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