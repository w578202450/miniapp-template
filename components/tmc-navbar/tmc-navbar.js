var sysinfo = wx.getSystemInfoSync();

Page({
  data: {
    statusBarHeight: sysinfo.statusBarHeight,
  },
  onLoad: function () {
  }
})

Component({
  properties: {
    background: {
      type: String,
      value: 'rgba(255, 255, 255, 0)'
    },
    color: {
      type: String,
      value: '#FFFFFF'
    },
    titleText: {
      type: String,
      value: '订单详情'
    },
    titleImg: {
      type: String,
      value: ''
    },
    backIcon: {
      type: String,
      value: '../../images/public/public_back.png'
    },
    homeIcon: {
      type: String,
      value: ''
    },
    iconHeight: {
      type: Number,
      value: 19
    },
    iconWidth: {
      type: Number,
      value: 58
    }
  },
  attached: function () {
    var that = this;
    that.setNavSize();
    that.setStyle();
  },
  data: {
  },
  methods: {
    // 通过获取系统信息计算导航栏高度        
    setNavSize: function () {
      var that = this
        , sysinfo = wx.getSystemInfoSync()
        , statusHeight = sysinfo.statusBarHeight
        , isiOS = sysinfo.system.indexOf('iOS') > -1
        , navHeight;
      if (!isiOS) {
        navHeight = 48;
      } else {
        navHeight = 44;
      }
      that.setData({
        status: statusHeight,
        navHeight: navHeight
      })
    },
    setStyle: function () {
      var that = this
        , containerStyle
        , textStyle
        , iconStyle;
      containerStyle = [
        'background:' + that.data.background
      ].join(';');
      textStyle = [
        'color:' + that.data.color,
        'font-size:' + that.data.fontSize + 'px'
      ].join(';');
      iconStyle = [
        'width: ' + that.data.iconWidth + 'px',
        'height: ' + that.data.iconHeight + 'px'
      ].join(';');
      that.setData({
        containerStyle: containerStyle,
        textStyle: textStyle,
        iconStyle: iconStyle
      })
    },
    // 返回事件        
    back: function () {
      wx.navigateBack({
        delta: 1
      })
      this.triggerEvent('back', { back: 1 })
    },
    home: function () {
      this.triggerEvent('home', {});
    }
  }
})