/*引入本地定义的json数据的js*/
var addressData = require("../address.js");
const HTTP = require('../../../utils/http-util')
const Common = require('../../../common/common')
const commonFun = require('../../../utils/common')

/**
 * count=0表示当前创建地址为默认地址 
 * 编辑地址：item编辑地址的时候会传递地址信息item
 */
Page({
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

  onLoad: function(e) {
    this.data.isFirstAddress = e.count == 0 ? true : false
    if (e.item) {
      let item = JSON.parse(e.item)
      this.data.addressInfo = item
      this.data.edit = item ? true : false
      this.data.receiverName = item.receiverName
      this.data.receiverPhone = item.receiverPhone
      this.data.address = item.address
      this.data.provinceCode = item.provinceCode
      this.data.province = item.province
      this.data.cityCode = item.cityCode
      this.data.city = item.city
      this.data.areaCode = item.areaCode
      this.data.area = item.area

      //获取对应的地址index
      let provinces = addressData.adressList
      for (var index in provinces) { //省
        if (provinces[index].value == item.provinceCode) {
          this.data.multiArray[0] = provinces
          this.data.multiIndex[0] = index
          break;
        }
      }

      let citys = provinces[this.data.multiIndex[0]].children
      for (var index in citys) { //市
        if (citys[index].value == item.cityCode) {
          this.data.multiArray[1] = citys
          this.data.multiIndex[1] = index
          break;
        }
      }

      let areas = citys[this.data.multiIndex[1]].children
      for (var index in areas) { //市
        if (areas[index].value == item.areaCode) {
          this.data.multiArray[2] = areas
          this.data.multiIndex[2] = index
          break;
        }
      }

      if (this.data.provinceCode &&
        this.data.province &&
        this.data.city &&
        this.data.cityCode &&
        this.data.areaCode &&
        this.data.area) {
        this.data.noSelected = false
      }

      this.setData({
        receiverName: item.receiverName,
        receiverPhone: item.receiverPhone,
        address: item.address,
        edit: this.data.edit,
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex,
        noSelected: this.data.noSelected
      })
    }

    console.log('--------', e);
    console.log('--------', this.data.isFirstAddress);

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
    console.log('列', e.detail.column, '，行', e.detail.value);
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
    if (this.data.edit) {
      this.editAddress()
    } else {
      this.addAddress()
    }
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
            success: function(res) {
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
  },
  /**
   * 编辑地址
   */
  editAddress() {
    var that = this
    wx.showLoading({
      title: '保存中...',
    });
    HTTP.updateAddress({
        "receiverName": this.data.receiverName,
        "receiverPhone": this.data.receiverPhone,
        "provinceCode": this.data.provinceCode,
        "province": this.data.province,
        "cityCode": this.data.cityCode,
        "city": this.data.city,
        "areaCode": this.data.areaCode,
        "area": this.data.area,
        "address": this.data.address,
        "keyID": this.data.addressInfo.keyID,
        'modifyUser': this.data.addressInfo.modifyUser,
        "personID": wx.getStorageSync('personID')
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '保存成功',
            success: function() {
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
  },
  /**
   * 删除地址
   */
  deleteAction: function(e) {
    if (this.data.addressInfo == null) {
      wx.showToast({
        title: '地址不存在',
        icon: 'none'
      })
      return;
    }
    var that = this
    if (this.data.addressInfo.isDefault == 1) {
      wx.showToast({
        title: '当前为默认地址',
        icon: 'none'
      })
      return;
    }

    wx.showModal({
      content: '确定删除当前地址？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });
          HTTP.deleteAddress({
              addrID: that.data.addressInfo.keyID,
              personID: wx.getStorageSync('personID')
            })
            .then(res => {
              wx.hideLoading();
              if (res.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  success: function() {
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

        } else if (res.cancel) {

        }
      }

    })
  },
  /**
   * 返回
   */
  navigateBack() {
    let currentPage = null; //当前页面
    let prevPage = null; //上一个页面
    let pages = getCurrentPages();
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.loadDatas()
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  }
})