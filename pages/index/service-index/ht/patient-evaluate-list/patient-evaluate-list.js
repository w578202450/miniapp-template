// pages/index/service-index/ht/patient-evaluate-list/patient-evaluate-list.js
const HTTP = require('../../../../../utils/http-util');
const commonFun = require('../../../../../utils/common.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialImgBac: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png", // 评论内容中的背景图片
    videoIconSrc: "/images/chat/videoPlayIcon.png", // 视频播放按钮的图标
    illnessSumList: [], // 患者评价的统计数据
    evaluateListData: [], // 患者评价的内容
    httpParams: {}, // 查看更多数据的请求参数
    pageInfo: {
      pageIndex: 1,
      pageSize: 20
    },
    navbarTitle: "患者评价" // 传递的页面标题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.setNavigationBarTitle({
    //   title: "侯丽萍医生的评价"
    // });
    let that = this;
    if (options.httpParams) {
      that.data.httpParams = JSON.parse(options.httpParams);
      // console.log("进入患者评价列表页拿到的参数：" + JSON.stringify(that.data.httpParams));
      that.getPatientEvaluateListFun(); // 查询：患者评价列表数据
      that.initNoRealyData(); // 拟定假数据
    } else {
      wx.showToast({
        title: '数据异常，无法正常展示',
        icon: "none",
        duration: 3000
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
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
    let obj = {
      doctorID: this.data.httpParams.doctorID,
      orgID: this.data.httpParams.orgID,
      doctorName: this.data.httpParams.doctorName
    };
    let httpParams = 'httpParams=' + JSON.stringify(obj);
    return commonFun.onShareAppMessageFun(this.data.httpParams.nextPage, httpParams);
  },

  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  },

  /**查询：患者评价列表数据 */
  getPatientEvaluateListFun: function() {
    let that = this;
    let params = {
      orgID: that.data.httpParams.orgID,
      doctorStaffID: that.data.httpParams.doctorID,
      pageIndex: that.data.pageInfo.pageIndex,
      pageSize: that.data.pageInfo.pageSize
    };
    HTTP.orderCommentList(params).then(res => {
      if (res.code == 0 && res.data) {
        that.setData({
          evaluateListData: res.data.datas ? res.data.datas : [],
          totalRow:res.data.totalRow,
          doctorName: that.data.httpParams.doctorName
        });
      } else {
        wx.showToast({
          title: '获取评价列表数据失败',
          icon: "none",
          duration: 3000
        });
      }
    });
  },

  /**操作：点击某张图片或者某个视频 */
  toDetailFun: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index; // 点击的评论（即item）所在下标
    let indexs = e.currentTarget.dataset.indexs; // 点击的图片所在评论的orderCommentMaterial中的（即items）下标
    let materialItem = {
      ...e.currentTarget.dataset.material
    }; // 点击的items
    // materialType： 0图片 1视频
    if (materialItem.materialType == 0) {
      let allMaterial = that.data.evaluateListData[index].orderCommentMaterial; // 临时存储点击的评论的所有图片、视频素材
      let previewImgArr = []; // 要展示的图片集合
      allMaterial.forEach((item) => {
        if (item.materialType == 0) {
          previewImgArr.push(item.materialUrl);
        }
      });
      wx.previewImage({
        current: e.currentTarget.dataset.material.materialUrl, // 当前图片地址 必须是---线上---的图片
        urls: previewImgArr, // 所有要预览的图片的地址集合 数组形式
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {}
      });
    } else if (materialItem.materialType == 1) {
      if (materialItem.materialUrl.length == 0 || !materialItem.materialUrl) {
        wx.showToast({
          title: '视频链接地址错误，无法查看',
          icon: "none",
          duration: 3000
        });
        return;
      }
      let materialData = {
        materialType: 1, // （必传）要查看的素材类型 0图文 1视频
        title: "患者评价相关素材", // 待确认，可先不传
        url: encodeURIComponent(materialItem.materialUrl), // （必传）图文、视频 的网络地址链接
        logoUrl: encodeURIComponent("") // 视频的封面图片(没有就传空字符窜)
      };
      wx.navigateTo({
        url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
      });
    }
  },

  initNoRealyData: function() {
    let illList = [{
        keyID: "1",
        illnessName: "医生服务好",
        num: ""
      },
      {
        keyID: "2",
        illnessName: "疗效显著",
        num: ""
      },
      {
        keyID: "3",
        illnessName: "物流快",
        num: ""
      }
    ];
    this.setData({
      illnessSumList: illList
    });
  },

  goInquiry(){
    if (app.globalData.isInitInfo) {
      wx.navigateTo({
        url: '/pages/online-inquiry/inquiry/chat/chat'
      });
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  }
})