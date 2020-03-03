// pages/index/service-index/fzm/service-tabs/service-tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageStyle: {
      type: String,
      value: ''
    },
    tabStyle: {
      type: String,
      value: ''
    },
    list:{
      type: Array,
      value: []
    }
    // let list = {
    //   "datas": [{
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     videoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 1,
    //     id: "0"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "1"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "2"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "3"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "4"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "5"
    //   }, {
    //     title: "带你了解主动脉疾病的杂交手术治疗",
    //     summary: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
    //     tag: "典型病例, 专家推荐",
    //     logoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
    //     articleType: 0,
    //     id: "6"
    //   }],
    //   "pageSize": 4,
    //   "pageIndex": 0
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})