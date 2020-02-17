// 公共的方法

/**
 * 右上角的分享功能
 */
function onShareAppMessageFun() {
  return {
    // title: "",    // 转发的标题，默认是小程序的名称(可以写slogan等)
    path: '/pages/login/login',    // 默认是当前页面，必须是以‘/'开头的完整路径
    // imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    success: function (res) {
      console.log("转发成功:" + JSON.stringify(res));
    },
    fail: function (res) {
      console.log("转发失败:" + JSON.stringify(res));
    }
  }
}

module.exports = {
  onShareAppMessageFun: onShareAppMessageFun
}