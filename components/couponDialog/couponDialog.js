// components/couponDialog/couponDialog.js.
import { requestMsgFun } from '../../utils/common.js';
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      couponData:{
        type: Object,
        value: {
          rules:{}
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHideCoupon:true
  },
  attached:function(options){},
  /**
   * 组件的方法列表
   */
  methods: {
    hideCouponDialog: function(){
      this.setData({
        isHideCoupon: true
      });
    },
    showCouponDialog: function() {
      /** 这里判断是否是需要的机构 */
      this.setData({
        isHideCoupon: false
      });
    },
    confirm(){
      this.setData({
        isHideCoupon: true
      });
      let pages = getCurrentPages(); //获取加载的页面
      let currentPage = pages[pages.length - 1]; //获取当前页面的对象
      let url = currentPage.route
      if(url!='pages/online-inquiry/inquiry/chat/chat'){
        requestMsgFun()
      }
    },
  }
})