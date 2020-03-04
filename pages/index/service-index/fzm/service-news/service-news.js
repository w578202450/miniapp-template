var appBehavior = require('../behaviors/fzm-behaviors')
const HTTP = require('../../../../../utils/http-util');
const app = getApp()

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
    articleTitles: Array,
    // 文章
    articleDatas: {
      type: {
        String: Object
      },
      value: {}
    },

    currentCategoryData: {
      type: {
        String: Object
      },
      value: {
        'hasMore': false,
        'hasData': false
      }
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
      let currentIndex = e.detail.current
      let navitem = this.data.articleTitles[currentIndex]
      let currentClassifyID = e.detail.currentItemId
      let currentCategoryData = this.data.articleDatas[currentClassifyID]
      if (currentCategoryData.datas && currentCategoryData.datas.length > 0) {
        this.setData({
          currentCategoryData: currentCategoryData
        })
      } else {
        this.loadDatas(currentClassifyID, currentCategoryData, navitem.orgID)
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
    loadDatas(currentClassifyID, currentCategoryData, orgID) {
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex,
        "classifyID": currentClassifyID
      }).then(res => {
        let list = res.data
        if (list.datas) {
          if (list.datas.length > 0) {
            currentCategoryData["hasData"] = true
            if (list.datas.length < currentCategoryData.pageSize) {
              currentCategoryData["hasMore"] = false
            } else {
              currentCategoryData["hasMore"] = true
              currentCategoryData["pageIndex"] = currentCategoryData.pageIndex + 1
            }
            currentCategoryData.datas = list.datas
            this.data.articleDatas[currentClassifyID] = currentCategoryData
            this.setData({
              articleDatas: this.data.articleDatas
            })
          } else if (list.datas.length == 0){
            currentCategoryData["hasData"] = false
            this.setData({
              articleDatas: this.data.articleDatas
            })
          }

        } else {
          // 不许渲染数据
        }
      });
    },
    /**
     * 上拉加载获取更多的数据
     */
    uploadMoreDatas(e) {
      let currentClassifyID = e.currentTarget.dataset.navitem.keyID
      let orgID = e.currentTarget.dataset.navitem.orgID
      let currentCategoryData = this.data.articleDatas[currentClassifyID]
      if (!currentCategoryData.hasMore) {
        return
      }
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex + 1,
        "classifyID": currentClassifyID
      }).then(res => {
        let list = res.data
        if (list.datas) {
          if (list.datas.length > 0) {
            currentCategoryData["hasData"] = true
            if (list.datas.length < currentCategoryData.pageSize) {
              currentCategoryData["hasMore"] = false
            } else {
              currentCategoryData["hasMore"] = true
              currentCategoryData["pageIndex"] = currentCategoryData["pageIndex"] + 1
            }
            currentCategoryData.datas.push(list.datas)
            this.setData({
              articleDatas: this.data.articleDatas
            })
            
          } else if (list.datas.length == 0) {
            currentCategoryData["hasMore"] = false
            this.setData({
              articleDatas: this.data.articleDatas
            })
          }
        } else {
          // 不许渲染数据
        }
      })
    },
    /**
     * 详情查看
     */
    itemDetails(e){
      let title = e.currentTarget.dataset.navTitle
      let item = e.currentTarget.dataset.item
      let materialData = {
        materialType: item.articleType, // （必传）要查看的素材类型 0图文 1视频
        title: title, // 待确认，可先不传
        url: item.articleUrl, // （必传）图文、视频 的网络地址链接
        logoUrl: item.logoUrl // 视频的封面图片(没有就传空字符窜)
      };
      wx.navigateTo({
        url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
      });

    }

  }
})