// components/address/add/add.js
var addressData = require("../../../pages/address/address");
const HTTP = require('../../../utils/http-util');
const Common = require('../../../common/common');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    addressInfo: null,
    edit: false,
    receiverName: '',
    receiverPhone: '',
    address: '',
    multiArray: [addressData.adressList, addressData.adressList[21].children, addressData.adressList[21].children[0].children],
    multiIndex: [21, 0, 0],
    provinceCode: "",
    province: "",
    cityCode: "",
    city: "",
    areaCode: "",
    area: '',
    isFirstAddress: false,
    noSelected: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent("closeAddAddress")
    },
    /**
     * 地址选择器确定操作
     */
    bindMultiPickerChange(e) {
      this.data.multiIndex = e.detail.value
      this.data.noSelected = false
      this.setData({
        multiIndex: e.detail.value,
        noSelected: this.data.noSelected
      })
    },
    /**
     * 地址选择器滚动列表
     */
    bindMultiPickerColumnChange(e) {
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      switch (e.detail.column) {
        case 0:
          data.multiArray[1] = addressData.adressList[e.detail.value].children;
          data.multiArray[2] = addressData.adressList[e.detail.value].children[0].children;
          data.multiIndex[1] = 0;
          data.multiIndex[2] = 0;
          break;
        case 1:
          data.multiArray[2] = data.multiArray[1][e.detail.value].children;
          data.multiIndex[2] = 0;
          break;
      }
      this.setData({
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      });
    },
    /**
     * 输入收货名字
     */
    receiverNameInput(e) {
      let that = this;
      let value = Common.filterEmoji(e.detail.value);
      that.setData({
        receiverName: value
      });
      // return {
      //   value: value
      // }
    },
    /***
     * 输入收货人电话
     */
    receiverPhoneInput(e) {
      this.data.receiverPhone = e.detail.value
    },
    /**
     * 输入详细地址
     */
    addressInput(e) {
      let value = Common.filterEmoji(e.detail.value)
      this.data.address = value;
      return {
        value: value
      }

    },
    /**
     * 保存地址
     */
    saveOptions() {
      if (!this.data.receiverName) {
        wx.showToast({
          title: '请填写收货人姓名',
          icon: 'none'
        })
        return
      }
      if (!this.data.receiverPhone) {
        wx.showToast({
          title: '请填写手机号码',
          icon: 'none'
        })
        return
      }
      if (this.data.noSelected) {
        wx.showToast({
          title: '请填写省市区',
          icon: 'none'
        })
        return
      }
      if (!this.data.address) {
        wx.showToast({
          title: '请填写详细地址',
          icon: 'none'
        })
        return
      }
      this.data.province = this.data.multiArray[0][this.data.multiIndex[0]].label
      this.data.provinceCode = this.data.multiArray[0][this.data.multiIndex[0]].value
      this.data.city = this.data.multiArray[1][this.data.multiIndex[1]].label
      this.data.cityCode = this.data.multiArray[1][this.data.multiIndex[1]].value
      this.data.area = this.data.multiArray[2][this.data.multiIndex[2]].label
      this.data.areaCode = this.data.multiArray[2][this.data.multiIndex[2]].value
      this.addAddress()
    },
    /**
     * 添加地址
     */
    addAddress() {
      let that = this
      wx.showLoading({
        title: '保存中...',
      });

      HTTP.addAddress({
          "personID": wx.getStorageSync('personID'),
          "receiverName": this.data.receiverName,
          "receiverPhone": this.data.receiverPhone,
          "provinceCode": this.data.provinceCode,
          "province": this.data.province,
          "cityCode": this.data.cityCode,
          "city": this.data.city,
          "areaCode": this.data.areaCode,
          "area": this.data.area,

          "address": this.data.address,
          "isDefault": this.data.isFirstAddress ? "1" : "0"
        })
        .then(res => {
          wx.hideLoading();
          if (res.code == 0) {
            wx.showToast({
              title: '保存成功',
              success: function (res) {
                that.navigateBack()
              }
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }

        }).catch(e => {
          wx.hideLoading();
        })
    }
  }
})