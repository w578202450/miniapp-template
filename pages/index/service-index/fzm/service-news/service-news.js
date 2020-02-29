var appBehavior = require('../behaviors/fzm-behaviors')

Component({
  behaviors: [appBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 默认选项卡index
     */
    currentIndex: {
      type: Number,
      value: 0
    },
    titles: {
      type: Array,
      value: [{
          "name": "专家文章",
          "id": "0"
        },
        {
          "name": "民医讲堂",
          "id": "1"
        }, {
          "name": "精选科普",
          "id": "2"
        }
      ]
    },
    list: {
      type: Array,
      value: [{
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "0"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "1"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "2"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "3"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "4"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "5"
      }, {
        title: "带你了解主动脉疾病的杂交手术治疗",
        content: "所谓杂交手术，又称复合技术，是近几年兴起的心脏领域前沿技术，就是心内介入与外科两种…",
        tags: ["典型病例", "专家推荐"],
        image: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png",
        id: "6"
      }]
    }
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
    /**
     * swiper切换
     */
    pagechange: function(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },
    /**
     * 点击tab
     */
    titleClick: function(e) {
      var index = e.currentTarget.dataset.idx;
      if (this.data.currentIndex == index) {
        return false;
      } else {
        this.setData({
          currentIndex: index
        });
      }
    },

    ddddddddddd: function (e) {
      console.log('dddddddddd------',e)
    }
  }
})