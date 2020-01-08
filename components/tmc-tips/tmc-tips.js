
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  }
})

Component({
  properties: {
    icon:{
      type:String,
      value: "/images/public/public_no_internet.png"
    },
    title:{
      type:String,
      value:"网络连接异常"
    },
    message:{
      type:String,
      value:"网络不太好，刷新一下吧"
    },
    buttonTitle: {
      type: String,
      value:"刷新"
    },
  },
  data: {

  },
  methods: {
    // 按钮事件  
    buttonOption:function(e){
      this.triggerEvent('buttonOption')
    } 
  }
})

