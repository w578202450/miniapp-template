// pages/order/order-evaluate/order-evaluate.js
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeightNum: "", // 屏幕高度
    personInfo: {}, // 患者个人信息
    paramsData: {
      orderID: "", // 评价的订单ID
      orgID: "", // 订单所属 医院ID
      doctorStaffID: "", // 开单的医生的ID
      disease: "", // 所患疾病
    }, // 传递过来的参数
    curativeEffect: 5, // 疗效初始星的颗数
    doctorAttitude: 5, // 服务初始星的颗数
    isSatisfaction: true, // 是否满意
    curativeEffectList: [{
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      }
    ], // 疗效星级列表初始数据
    doctorAttitudeList: [{
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      },
      {
        isTrue: true,
        iconSrc: "/images/order/xingIcon.png",
        iconBacSrc: "/images/order/xingIconBot.png"
      }
    ], // 服务星级列表初始数据
    content: "", // 评价的文本内容，最长200字符
    countIndex: 9, // 可选图片剩余的数量
    imageData: [], // 所选上传成功后的图片数据
    orderStatusID: 10, // 订单的状态
    isSearched: false, // 是否查询过了
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("评价页接收到的参数：" + JSON.stringify(options));
    that.data.personInfo = wx.getStorageSync("personInfo");
    if (options && options.paramsData) {
      let paramsD = JSON.parse(options.paramsData);
      this.data.paramsData.orderID = paramsD.orderID;
      this.data.paramsData.orgID = paramsD.orgID;
      that.getOrderDetailFun(); // 查询订单详情
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeightNum: res.windowHeight // 保存屏幕高度
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.data.isSearched) {
      this.getOrderDetailFun(); // 再次查询订单详情
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return commonFun.onShareAppMessageFun();
  },

  /**
   * 查询：订单详情 
   * */
  getOrderDetailFun: function() {
    let that = this;
    let params = {
      orderID: that.data.paramsData.orderID,
      orgID: that.data.paramsData.orgID
    };
    HTTP.goodsOrder(params).then(res => {
      if (res.code == 0 && res.data) {
        that.setData({
          orderStatusID: res.data.orderStatusID
        })
        that.getRpDetailFun(res.data.rpID);
      } else {
        commonFun.showToastFun("查询订单详情失败");
      }
    });
  },

  /**
   * 查询：处方详情 
   * */
  getRpDetailFun: function(rpID) {
    let that = this;
    let params = {
      rpID: rpID,
      orgID: that.data.paramsData.orgID
    };
    HTTP.getRp(params).then(res => {
      if (res.code == 0 && res.data) {
        this.data.paramsData.doctorStaffID = res.data.doctorStaffID;
        this.data.paramsData.doctorName = res.data.doctorName;
        this.data.paramsData.disease = res.data.diagnosis;
        this.data.isSearched = true;
      } else {
        commonFun.showToastFun("查询处方详情失败");
      }
    });
  },

  /**操作：点击满意 */
  clickSatSure: function() {
    this.setData({
      isSatisfaction: true
    });
  },

  /**操作：点击不满意 */
  clickSatNot: function() {
    this.setData({
      isSatisfaction: false
    });
  },

  /**操作：点击星级 */
  clickXingIconFun: function(e) {
    let clickedIndex = e.currentTarget.dataset.index;
    let clickedType = e.currentTarget.dataset.type;
    if (clickedType == "curativeEffect") {
      let curEffList = this.data.curativeEffectList;
      curEffList.forEach((item, index) => {
        item.isTrue = true;
        if (clickedIndex < index) {
          item.isTrue = false;
        }
      });
      this.setData({
        curativeEffectList: curEffList,
        curativeEffect: clickedIndex + 1
      });
    } else if (clickedType == "doctorAttitude") {
      let docAttList = this.data.doctorAttitudeList;
      docAttList.forEach((item, index) => {
        item.isTrue = true;
        if (clickedIndex < index) {
          item.isTrue = false;
        }
      });
      this.setData({
        doctorAttitudeList: docAttList,
        doctorAttitude: clickedIndex + 1
      });
    }
  },

  /**输入评价内容 */
  onInputValue: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**操作：添加图片 */
  /*1.图片浏览及上传 */
  browseImgFun: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function(res) {
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

  /*2.打开相册、相机 */
  chooseWxImage: function(type) {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        wx.showLoading({
          title: "上传中, 请稍等…"
        });
        // 选择图片后的完成确认操作
        let remainNum = that.data.countIndex - res.tempFilePaths.length;
        if (remainNum < 1) {
          remainNum = 0;
        }
        // 遍历数组，上传图片到服务器
        let tempFilePathsData = res.tempFilePaths;
        that.upLoadImgFun(tempFilePathsData, remainNum); // 上传图片到服务器
      }
    })
  },

  /**上传：图片到服务器 */
  upLoadImgFun: function(tempFilePathsData, remainNum) {
    let that = this;
    let orderCommentMaterial = []; // 每次选择添加的图片并上传到服务器后的图片信息
    tempFilePathsData.forEach((item, index) => {
      wx.uploadFile({
        url: HTTP.uploadFileUrl(),
        filePath: item,
        name: 'file',
        header: {
          'content-Type': 'multipart/form-data'
        },
        formData: {
          "systemCode": "TMC",
          "belongCode": "CONTENT",
          "belongID": that.data.paramsData.orgID
        },
        success(res) {
          if (res.data) {
            let successData = JSON.parse(res.data);
            if (successData.code == 0) {
              let obj = {
                materialType: 0, // 0图片 1 视频
                materialID: successData.data.keyID,
                materialUrl: successData.data.remoteAddress
              }; // 存储图片信息的参数格式
              orderCommentMaterial.push(obj);
            }
          }
        },
        fail(err) {
          console.log(err);
        },
        complete(res) {
          if (tempFilePathsData.length - 1 == index) {
            setTimeout(() => {
              that.setData({
                imageData: [...that.data.imageData, ...orderCommentMaterial],
                countIndex: remainNum
              });
              wx.hideLoading();
            }, 500)
          }
        }
      });
    });
  },

  /**操作：查看大图 */
  previewImgFun: function(e) {
    let index = e.currentTarget.dataset.index; // 点击的图片所在下标
    let previewArr = [];
    this.data.imageData.forEach(item => {
      previewArr.push(item.materialUrl);
    });
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前图片地址 必须是---线上---的图片
      urls: previewArr, // 所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },

  /**操作：删除已选图片 */
  deleteAddedImgFun: function(e) {
    let index = e.currentTarget.dataset.index; // 点击的图片所在下标
    let imgArr = [...this.data.imageData];
    imgArr.splice(index, 1);
    this.setData({
      imageData: imgArr,
      countIndex: this.data.countIndex + 1
    });
  },

  /**操作：确认提交 */
  submitEvaluateFun: function() {
    if (this.data.commentStatusID == 1) {
      commonFun.showToastFun("订单已经评价过了，无法再次评价");
      return
    }
    let params = {
      ...this.data.paramsData,
      generalCommentID: this.data.isSatisfaction ? 0 : 1, // 总评ID 0:满意 1：不满意
      curativeEffect: this.data.curativeEffect, // 疗效
      doctorAttitude: this.data.doctorAttitude, // 服务
      content: this.data.content, // 评价内容
      patientID: this.data.personInfo.keyID, // TMC的患者ID
      patientName: this.data.personInfo.patientName,
      patientFace: app.globalData.userInfo.avatarUrl, // 患者头像
      orderCommentMaterial: this.data.imageData // 要保存的图片信息
    };
    HTTP.orderCommentSave(params).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: '/pages/order/order-evaluate-success/order-evaluate-success',
        });
      } else {
        commonFun.showToastFun("提交订单评价失败");
      }
    });
  }
})