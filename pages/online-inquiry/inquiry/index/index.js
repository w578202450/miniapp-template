Page({
  data: {
    aimgurl: "", // //临时图片的路径
    countIndex: 1, // 可选图片剩余的数量
    imageData: [] // 所选上传的图片数据
  },

  /*图片浏览及上传 */
  browse: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#438BEF",
      success: function(res) {
        // console.log(res)
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album');
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera');
          }
        }
      }
    })
  },

  /*打开相册*/
  chooseWxImage: function() {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["album"],
      success: function(res) {
        // 选择图片完成后的确认操作
        that.setData({
          aimgurl: res.tempFilePaths
        });
      }
    })
  },

  /*打开相机 */
  cameraWxFun: function() {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["camera"],
      success: function (res) {
        // 选择图片完成后的确认操作
        that.setData({
          aimgurl: res.tempFilePaths
        });
      }
    })
  }
})