const HTTP = require('../../../utils/http-util');
import { onShareAppMessageFun } from '../../../utils/common.js';

let app = getApp()
/**
 * optionType为0 表示从个人中心进入地址列表界面
 * optionType为1 表示从其他界面进入地址列表界面
 */
Page({
  data: {
    list: [],
    optionType: 0
  },

  onLoad: function(e) {
    this.data.optionType = e.optionType
    this.loadDatas()
  },

  onPullDownRefresh() {
    this.loadDatas()
  },
  /**
   * 获取地址列表
   */
  loadDatas() {
    wx.showNavigationBarLoading()
    if (!app.globalData.personID) {
      wx.showToast({
        title: 'personID为空',
        icon: 'none'
      })
      return;
    }
    HTTP.getAddress({
        personID: app.globalData.personID
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        if (res.code == 0) {
          this.data.list = res.data
          this.setData({
            list: res.data,
            noNetwork: false
          })
        } else {
          this.setData({
            noNetwork: false
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      }).catch(e => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        this.setData({
          noNetwork: true
        })
      })
  },
  /**
   * 编辑地址
   */
  editAction: function(e) {
    var index = e.currentTarget.dataset.index;
    let item = JSON.stringify(this.data.list[index])
    wx.navigateTo({
      url: '/pages/address/address-add/address-add?count=' + this.data.list.length + '&item=' + item,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 选择地址
   */
  selectedAddress: function(e) {
    if (this.data.optionType == 0) { //从个人中心界面进入不做选择操作
      return;
    }
    var index = e.currentTarget.dataset.index;
    let pages = getCurrentPages(); //获取所有页面
    let currentPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.data.addressInfo = {
        name: this.data.list[index].receiverName,
        phone: this.data.list[index].receiverPhone,
        address: this.data.list[index].address,
        province: this.data.list[index].province,
        city: this.data.list[index].city,
        area: this.data.list[index].area,
        remarks: this.data.list[index].remarks ? this.data.list[index].remarks : '',
        isDefault: this.data.list[index].isDefault
      } //将想要传的信息赋值给上一个页面data中的值
      prevPage.setData({
        addressInfo: prevPage.data.addressInfo
      })
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 设置默认地址
   */
  defaultAddress: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var defaultIndex = null
    var defaultItem = null
    wx.showLoading({
      title: '设置中...',
    });
    HTTP.setDefault({
        "keyID": this.data.list[index].keyID,
        "personID": wx.getStorageSync('personID')
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '设置成功',
            success: function() {
              for (var i = 0; i < that.data.list.length; i++) {
                if (i == index) {
                  that.data.list[i].isDefault = 1;
                  defaultIndex = index
                  defaultItem = that.data.list[i]
                } else {
                  that.data.list[i].isDefault = 0;
                }
              }
              //删除默认项
              that.data.list.splice(defaultIndex, 1)
              //首位插入默认项
              that.data.list.unshift(defaultItem)
              //更新列表
              that.setData({
                list: that.data.list
              });
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
    var that = this
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      content: '确定删除当前地址？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除...',
          });
          HTTP.deleteAddress({
              "addrID": that.data.list[index].keyID,
              "personID": wx.getStorageSync('personID')
            })
            .then(res => {
              wx.hideLoading();
              if (res.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  success: function() {
                    that.data.list.splice(index, 1)
                    that.setData({
                      list: that.data.list
                    });
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

  noNetworkOption() {
    this.loadDatas()
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return onShareAppMessageFun();
  }
})