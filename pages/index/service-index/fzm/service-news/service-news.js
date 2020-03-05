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
    currentClassifyID: '', // 当前模块id
    loadingText:"正在加载中...",
    noDataText:"没有数据",
    noMoreDataText:"已经到底了",
    loadMoreDataText:"点击加载更多"
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
        // 这里先渲染再切换界面
        this.setData({
          currentCategoryData: currentCategoryData
        },function(){
          this.setData({
            currentIndex: e.detail.current
          })
        })
      } else {
        this.setData({
          currentIndex: e.detail.current
        })
        this.loadDatas(currentClassifyID, currentCategoryData, navitem.orgID)
      }
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
      currentCategoryData["loading"] = true
      this.setData({
        articleDatas: this.data.articleDatas
      })
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex,
        "classifyID": currentClassifyID
      }).then(res => {
        currentCategoryData["loading"] = false
        let list = res.data
        if (list.datas) {
          currentCategoryData["noData"] = list.datas.length === 0 ? true : false
          currentCategoryData["noMore"] = list.pageIndex < list.totalPage ? false : true
          if (list.pageIndex < list.totalPage) {
            currentCategoryData["pageIndex"] += 1
          }
          currentCategoryData.datas = list.datas
          this.data.articleDatas[currentClassifyID] = currentCategoryData
          this.setData({
            articleDatas: this.data.articleDatas
          })

        } else {
          console.log('res--------------------dddd',res)
          // 不许渲染数据
          this.setData({
            articleDatas: this.data.articleDatas
          })
        }
      }).catch(error =>{
        currentCategoryData["noMore"] = false;
        currentCategoryData["noData"] = false;
        currentCategoryData["loading"] = false;
        this.setData({
          articleDatas: this.data.articleDatas
        })
        wx.showToast({
          title: '网络连接失败',
        })
      });
    },
    /**
     * 上拉加载获取更多的数据
     */
    uploadMoreDatas(e) {
      let currentClassifyID = e.currentTarget.dataset.navitem.keyID
      let orgID = e.currentTarget.dataset.navitem.orgID
      let currentCategoryData = this.data.articleDatas[currentClassifyID]
      if (currentCategoryData.loading || currentCategoryData.noMore) {
        return
      }
      currentCategoryData["loading"] = true;
      this.setData({
        articleDatas: this.data.articleDatas
      })
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex,
        "classifyID": currentClassifyID
      }).then(res => {
        currentCategoryData["loading"] = false
        let list = res.data
        
        if (list.datas) {
          
          currentCategoryData["noData"] = list.datas.length === 0 ? true : false
          currentCategoryData["noMore"] = list.pageIndex < list.totalPage ? false : true
          if (list.pageIndex < list.totalPage) {
            currentCategoryData["pageIndex"] += 1
          }
          currentCategoryData.datas = [...currentCategoryData.datas, ...list.datas]
          this.setData({
            articleDatas: this.data.articleDatas
          })
          
        } else {
          // 不许渲染数据
        }
      }).catch(error =>{
        currentCategoryData["noMore"] = false;
        currentCategoryData["noData"] = false;
        currentCategoryData["loading"] = false;
        this.setData({
          articleDatas: this.data.articleDatas
        })
        wx.showToast({
          title: '网络连接失败',
        })
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