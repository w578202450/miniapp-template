var appBehavior = require('../behaviors/fzm-behaviors')
const HTTP = require('../../../../../utils/http-util');

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
    // 文章导航
    articleTitles: {
      type: Array,
      value: []
    },
    // 文章
    articleDatas:{
      type:{String:Object},
      value:{}
    },
    
    currentCategoryData: {
      type: { String: Object },
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    newsDatas: {
      String: Array
    }, // 文章列表{模块id:文章列表}}
    currentClassifyID: '' // 当前模块id
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * swiper切换
     */
    pagechange: function(e) {
      this.data.currentClassifyID = e.detail.currentItemId;
      this.data.currentIndex = e.detail.current;
      // 当前模块没有数据就进行网络加载请求
      let tempCurrentData = this.data.articleDatas[this.data.currentClassifyID];
      if (!tempCurrentData ||
        tempCurrentData.datas.length == 0){
        this.loadDatas(this.data.currentClassifyID)
      } else {
        this.data.currentCategoryData = tempCurrentData;
        this.setData({
          currentCategoryData: this.data.currentCategoryData
        })
      }
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
    /**
     * 根据文章id获取文章的列表
     */
    loadDatas(classifyID) {
      HTTP.articleByClassifyId({
        "orgID": "32132132132",
        "pageSize": 10,
        "pageIndex": 1,
        "classifyID": classifyID
      }).then(res => {
        if (res.data) {
          this.data.articleDatas[classifyID] = res.data;
          this.data.currentCategoryData = res.data;
          if (!res.data) {
            this.data.currentCategoryData["noMore"] = true
          } else if (res.data.datas.length == 0) {
            this.data.currentCategoryData["noMore"] = true
          } else if (res.data.datas.length < res.data.pageSize) {
            this.data.currentCategoryData["noMore"] = true
          } else {
            this.data.currentCategoryData["noMore"] = false
          }

          this.setData({
            currentCategoryData: this.data.currentCategoryData
          })
        }
      });
    },
    /**
     * 上拉加载获取更多的数据
     */
    uploadMoreDatas(e) {
      let classifyID = e.currentTarget.id;
      let index = e.currentTarget.dataset.index;
      var tempCurrentData = this.data.articleDatas[classifyID];
      if (tempCurrentData.noMore) {return}
      HTTP.articleByClassifyId({
        "orgID": "32132132132",
        "pageSize": 10,
        "pageIndex": tempCurrentData.pageIndex+1,
        "classifyID": this.currentClassifyID
      }).then(res => {
        if (res.data) {
           if (res.data.datas.length == 0) {
             tempCurrentData["noMore"] = true
             this.data.currentCategoryData = tempCurrentData;
             this.setData({
               currentCategoryData: this.data.currentCategoryData
             })
             return;
          } 

          if (res.data.datas.length < res.data.pageSize) {
             tempCurrentData["noMore"] = true
          } else {
             tempCurrentData["noMore"] = false
          }
          
          res.data.datas = tempCurrentData.datas.push(res.data.datas)
          this.data.currentCategoryData = res.data.datas;

          this.setData({
            currentCategoryData: this.data.currentCategoryData
          })
        }
      });
    },

  }
})