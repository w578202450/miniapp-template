import {
  SDKAPPID
} from '../../../../utils/GenerateTestUserSig'

import {
  genTestUserSig
} from '../../../../utils/GenerateTestUserSig';

Page({
  // /**
  //  * 页面的初始数据
  //  */
  // data: {
  //   template: 'float',
  //   webrtcroomComponent: null,
  //   roomID: '123', // 房间id
  //   beauty: 0,
  //   muted: false,
  //   debug: false,
  //   frontCamera: true,
  //   role: ROLE_TYPE.PRESENTER, // presenter 代表主播，audience 代表观众
  //   userId: '20010620211271745513006001',
  //   userSig: genTestUserSig("20010620211271745513006001").userSig,
  //   sdkAppID: SDKAPPID,
  //   isErrorModalShow: false,
  //   autoplay: true,
  //   enableCamera: true,
  //   smallViewLeft: 'calc(100vw - 30vw - 2vw)',
  //   smallViewTop: '20vw',
  //   smallViewWidth: '30vw',
  //   smallViewHeight: '40vw',
  // },


  // /**
  //  * 监听webrtc事件
  //  */
  // onRoomEvent(e) {
  //   var self = this;
  //   switch (e.detail.tag) {
  //     case 'error':
  //       if (this.data.isErrorModalShow) { // 错误提示窗口是否已经显示
  //         return;
  //       }
  //       this.data.isErrorModalShow = true;
  //       wx.showModal({
  //         title: '提示',
  //         content: e.detail.detail,
  //         showCancel: false,
  //         complete: function () {
  //           self.data.isErrorModalShow = false;
  //           self.goBack();
  //         }
  //       });
  //       break;
  //   }
  // },

  // /**
  //  * 切换摄像头
  //  */
  // changeCamera: function () {
  //   this.data.webrtcroomComponent.switchCamera();
  //   this.setData({
  //     frontCamera: !this.data.frontCamera
  //   })
  // },

  // /**
  //  * 开启/关闭摄像头
  //  */
  // onEnableCameraClick: function () {
  //   this.data.enableCamera = !this.data.enableCamera;
  //   this.setData({
  //     enableCamera: this.data.enableCamera
  //   });
  // },


  // /**
  //  * 设置美颜
  //  */
  // setBeauty: function () {
  //   this.data.beauty = (this.data.beauty == 0 ? 9 : 0);
  //   this.setData({
  //     beauty: this.data.beauty
  //   });
  // },

  // /**
  //  * 切换是否静音
  //  */
  // changeMute: function () {
  //   this.data.muted = !this.data.muted;
  //   this.setData({
  //     muted: this.data.muted
  //   });
  // },

  // /**
  //  * 是否显示日志
  //  */
  // showLog: function () {
  //   this.data.debug = !this.data.debug;
  //   this.setData({
  //     debug: this.data.debug
  //   });
  // },

  // /**
  //  * 进入房间
  //  */
  // joinRoom: function () {
  //   // 设置webrtc-room标签中所需参数，并启动webrtc-room标签
  //   this.setData({
  //     userID: this.data.userId,
  //     userSig: this.data.userSig,
  //     sdkAppID: this.data.sdkAppID,
  //     roomID: this.data.roomID
  //   }, () => {
  //     this.data.webrtcroomComponent.start();
  //   })
  // },

  // /**
  //  * 返回上一页
  //  */
  // goBack() {
  //   // var pages = getCurrentPages();
  //   // if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/video_call_footage/room/room')) {
  //   //   wx.navigateBack({
  //   //     delta: 1
  //   //   });
  //   // }
  // },


  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {
  //   this.data.roomID = options.roomID || '';
  //   this.data.userId = options.userId;
  //   this.data.userSig = options.userSig;
  //   this.data.template = options.template;
  //   this.data.sdkAppID = options.sdkAppID;

  //   this.data.webrtcroomComponent = this.selectComponent('#webrtcroom');

  //   this.setData({
  //     template: options.template
  //   });

  //   this.joinRoom();

  //   // 动态设置当前页面的标题 房间号+userid
  //   wx.setNavigationBarTitle({
  //     title: this.data.roomID + '-' + this.data.userId
  //   })
  // },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {
  //   var self = this;
  //   console.log('room.js onShow');
  //   // 保持屏幕常亮
  //   wx.setKeepScreenOn({
  //     keepScreenOn: true
  //   })
  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {
  //   console.log('room.js onHide');
  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {
  //   console.log('room.js onUnload');
  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },


  // onBack: function () {
  //   wx.navigateBack({
  //     delta: 1
  //   });
  // },
  data: {
    //...
    roomID: '123', // [必选]房间号，可以由您的服务指定
    userID: '20010620211271745513006001', // [必选]用户 ID，可以由您的服务指定，或者使用小程序的 openid
    userSig: genTestUserSig("20010620211271745513006001").userSig, // [必选]身份签名，需要从自行搭建的签名服务获取
    sdkAppID: '1400283798', // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
    template: 'float', // [必选]标识组件使用的界面模版，组件内置了 bigsmall，float，grid 三种布局
    privateMapKey: '', // 房间权限 key，需要从自行搭建的签名服务获取
    // 如果您没有在【控制台】>【实时音视频】>【您的应用名称】>【帐号信息】中启用权限密钥，可不用填
    beauty: 3, // 美颜指数，取值 0 - 9，数值越大效果越明显
    muted: false, // true 静音 false 不静音
    debug: false, // true 打印推流 debug 信息 fales 不打印推流 debug 信息
    enableIM: true // 是否启用IM
    // 其他配置参数可查看 API 文档
  },

  // 通过 onIMEvent 返回 IM 消息事件，如果 enableIM 已关闭，则可以忽略 onIMEvent
  onIMEvent: function(e) {
    switch (e.detail.tag) {
      case 'big_group_msg_notify':
        //收到群组消息
        console.debug(e.detail.detail)
        break;
      case 'login_event':
        //登录事件通知
        console.debug(e.detail.detail)
        break;
      case 'connection_event':
        //连接状态事件
        console.debug(e.detail.detail)
        break;
      case 'join_group_event':
        //进群事件通知
        console.debug(e.detail.detail)
        break;
    }
  },

  // 标签通过 onRoomEvent 返回内部事件
  onRoomEvent: function(e) {
    switch (e.detail.tag) {
      case 'error':
        {
          //发生错误
          var code = e.detail.code;
          var detail = e.detail.detail;
          break;
        }
    }
  },

  // 获取roomId
  getRoomId: function() {
    let that = this;
    let prams = {
      inquiryId: '20010911052179278411325001', // 问诊记录id	
      sponsorsId: '19080118270320640501523001', // 发起者id(患者id)
      receiverId: '19080118270320640501523001' // 接受者id(医生id)
    };
    HTTP.getRoomId(prams).then(res => {
      that.setData({
        roomID: res.data.roomID
      });
    })
  },

  // 从storage中获取患者信息
  getPersonInfo: function() {
    let that = this;
    wx.getStorage({
      key: 'personInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
        if (that.data.userInfo.keyID) {
          // 查询患者的多方对话
          that.getPatientMultiTalk();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('room.js onShow');
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('room.js onHide');
  },

  startWebrtc: function() {
    let that = this;
    var webrtcroomCom = that.selectComponent('#myroom');
    if (webrtcroomCom) {
      webrtcroomCom.start();
    }
  },

  onLoad: function(options) {
    console.log(options);
    // 这里需要调用签名服务获取 userSig 等签名信息
    // userSig 需要在您的业务服务器上计算，否则会泄露您的私钥从而造成安全隐患
    // userSig 的计算请阅读文档：https://cloud.tencent.com/document/product/647/17275
    // let that = this;
    // console.log('userID:' + that.data.userID);
    //**************************************从服务器获取usersig***************************************************** */
    // wx.request({
    //   url: 'http://10.0.0.210:6110/api/rp/initial/getUserSig',  // 您的计算 usersig 的服务器地址
    //   data: {
    //     userId: that.data.userID
    //   }, // 计算 usersig 所需要的参数，这里留空了，一般是需要带上 userid
    //   // 因为 usersig 本质上就是对 userid 和一些信息做了一个 ECDH 签名
    //   method: 'get',
    //   header: {
    //     'content-type': 'application/json',
    //     'token': 'aaaa'
    //   },
    //   success: function (res) {
    //     console.log('===获取UserSig请求成功===');
    //     console.log(
    //       "sdkAppID:" + that.data.sdkAppID + 
    //       ",roomID:" + that.data.roomID + 
    //       ",userSig:" + that.data.userSig);
    //     // HTTP 回包解析，此处代码仅仅是示例，正常情况下，应该可以解析出 userid，usersig 等信息
    //     // 有了这些信息，我们就可以调用 webrtc-room 对象实例的 start 方法来启动组件了
    //     that.setData({
    //       userID: that.data.userID,
    //       sdkAppID: that.data.sdkAppID,
    //       roomID: that.data.roomID,
    //       userSig: that.data.userSig
    //       // privateMapKey: '' // 房间权限 key，需要从自行搭建的签名服务获取
    //       //如果您没有在【控制台】>【实时音视频】>【您的应用名称】>【帐号信息】中启用权限密钥，可不用填
    //     }, function () {
    //       var webrtcroomCom = that.selectComponent('#myroom');
    //       if (webrtcroomCom) {
    //         webrtcroomCom.start();
    //       }
    //     })
    //   },
    //   fail: function () {
    //     console.error('===获取UserSig请求失败===');
    //   }
    // });
    //**************************************从服务器获取usersig***************************************************** */
    //   that.setData({
    //     userID: that.data.userID,
    //     sdkAppID: that.data.sdkAppID,
    //     roomID: that.data.roomID,
    //     userSig: that.data.userSig
    //   }),
    //   console.log(
    //     "userID:" + that.data.userID +
    //     ",sdkAppID:" + that.data.sdkAppID +
    //     ",roomID:" + that.data.roomID +
    //     ",userSig:" + that.data.userSig);
    // },
    let that = this;
    that.setData({
        userID: that.data.userID,
        sdkAppID: that.data.sdkAppID,
        roomID: that.data.roomID,
        userSig: that.data.userSig
      }),
      that.startWebrtc();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 设置房间标题
    wx.setNavigationBarTitle({
      title: '视频问诊'
    });
  }
})