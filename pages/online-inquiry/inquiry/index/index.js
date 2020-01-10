// Page({
//   data: {
//     aimgurl: "", // //临时图片的路径
//     countIndex: 1, // 可选图片剩余的数量
//     imageData: [], // 所选上传的图片数据
//     record: {
//       text: "长按录音",
//       type: "record",
//       iconPath: "../../../../images/chat/m-image.png",
//       handler: this.handleRecordStart
//     }, //与录音相关的数据结构
//     recorderManager: wx.getRecorderManager(), //录音管理上下文    
//     startPoint: {}, //记录长按录音开始点信息,用于后面计算滑动距离。
//     sendLock: true //发送锁，当为true时上锁，false时解锁发送
//   },

//   onLoad() {
//     this.recorderManager.onStop(res => {
//       if (this.sendLock) {
//         //上锁不发送
//       } else {//解锁发送，发送网络请求
//         if (res.duration < 1000)
//           wx.showToast({
//             title: "录音时间太短",
//             icon: "none",
//             duration: 1000
//           });
//         else this.contents = [...this.contents, { type: "record", content: res }];//contents是存储录音结束后的数据结构,用于渲染.
//       }
//     });
//   },

//   // 开始录音
//   handleRecordStart(e) {
//     //longpress时触发
//     this.startPoint = e.touches[0];//记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
//     this.record = {//修改录音数据结构，此时录音按钮样式会发生变化。
//       text: "松开发送",
//       type: "recording",
//       iconPath: "../../../../images/chat/m-image.png",
//       handler: this.handleRecordStart
//     };
//     this.recorderManager.start();//开始录音
//     wx.showToast({
//       title: "正在录音，上划取消发送",
//       icon: "none",
//       duration: 60000//先定义个60秒，后面可以手动调用wx.hideToast()隐藏
//     });
//     this.sendLock = false;//长按时是不上锁的。

//   },

//   // 松开录音
//   handleRecordStop() {
//     // touchend(手指松开)时触发
//     this.record = {//复原在start方法中修改的录音的数据结构
//       text: "长按录音",
//       type: "record",
//       iconPath: require("../../../../images/chat/m-image.png"),
//       handler: this.handleRecordStart
//     };
//     wx.hideToast();//结束录音、隐藏Toast提示框
//     this.recorderManager.stop();//结束录音
//   },

//   // 上滑取消发送
//   handleTouchMove(e) {
//     //touchmove时触发
//     var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY; //移动距离
//     if (Math.abs(moveLenght) > 50) {
//       wx.showToast({
//         title: "松开手指,取消发送",
//         icon: "none",
//         duration: 60000
//       });
//       this.sendLock = true;//触发了上滑取消发送，上锁
//     } else {
//       wx.showToast({
//         title: "正在录音，上划取消发送",
//         icon: "none",
//         duration: 60000
//       });
//       this.sendLock = false;//上划距离不足，依然可以发送，不上锁
//     }
//   },

//   /*图片浏览及上传 */
//   browse: function(e) {
//     let that = this;
//     wx.showActionSheet({
//       itemList: ['从相册中选择', '拍照'],
//       itemColor: "#438BEF",
//       success: function(res) {
//         // console.log(res)
//         if (!res.cancel) {
//           if (res.tapIndex == 0) {
//             that.chooseWxImage('album');
//           } else if (res.tapIndex == 1) {
//             that.chooseWxImage('camera');
//           }
//         }
//       }
//     })
//   },

//   /*打开相册*/
//   chooseWxImage: function() {
//     let that = this;
//     wx.chooseImage({
//       count: that.data.countIndex,
//       sizeType: ['original', 'compressed'],
//       sourceType: ["album"],
//       success: function(res) {
//         // 选择图片完成后的确认操作
//         that.setData({
//           aimgurl: res.tempFilePaths
//         });
//       }
//     })
//   },

//   /*打开相机 */
//   cameraWxFun: function() {
//     let that = this;
//     wx.chooseImage({
//       count: that.data.countIndex,
//       sizeType: ['original', 'compressed'],
//       sourceType: ["camera"],
//       success: function(res) {
//         // 选择图片完成后的确认操作
//         that.setData({
//           aimgurl: res.tempFilePaths
//         });
//       }
//     })
//   },

//   /*操作：下拉加载数据（页面相关事件处理函数——监听用户下拉动作） */
//   onPullDownRefresh: function() {
//     console.log("++++++下拉刷新++++++");
//     wx.showNavigationBarLoading(); //在标题栏中显示加载中的转圈效果
//     setTimeout(function () {
//       wx.hideNavigationBarLoading(); // 完成数据操作后停止标题栏中的加载中的效果
//       wx.stopPullDownRefresh(); // 停止下拉刷新过程
//       console.log("------停止刷新------");
//     }, 2000)
//   },

//   /*操作： 上拉刷新数据（页面上拉触发底事件的处理函数） */
//   onReachBottom: function() {

//   }
// })