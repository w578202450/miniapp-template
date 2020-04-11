var appBehavior = require('../behaviors/fzm-behaviors')
const HTTP = require('../../../../../utils/http-util');
const app = getApp()
// queryStatisticsList

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
    // 当前点击列表对象的下标
    itemIndex:{
      type: Number,
      value: 0
    },

    doctorStaffID: {
      type: String,
      value: ""
    },

    departmentCanSee: {
      type: String,
      value: ""
    }
  },
  

  observers: {
    // 发现articleTitles有数据的时候才会触发 并只触发一次 所以这个方法里面可以作为初始化数据
    "articleTitles": function(articleTitles) {
      if (!articleTitles || Object.keys(articleTitles).length === 0) {
        return;
      }
      let articleDatas = {};
      articleTitles.forEach((item) => {
        let currentCategoryData = {};
        currentCategoryData["noMore"] = false // 是否显示没有更多数据
        currentCategoryData["noData"] = false // 是否显示空数据占位
        currentCategoryData["loading"] = true // 是否显示正在加载提示
        currentCategoryData["noOnePage"] = true // 是否满一页数据
        currentCategoryData["pageSize"] = 10 //每页显示数据
        currentCategoryData["pageIndex"] = 1 //当前页数
        articleDatas[item.keyID] = currentCategoryData;
      })
      this.data.articleDatas = articleDatas;
      // 初始化文章模块第一栏的数据
      this.articleByClassifyId();
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    newsDatas: {
      String: Array
    }, // 文章列表{模块id:文章列表}}
    currentClassifyID: '', // 当前模块id
    loadingText: "正在加载中...",
    noDataText: "暂无数据",
    noMoreDataText: "已经到底了",
    loadMoreDataText: "点击加载更多"
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化文章数据 取第一条数据
     */
    articleByClassifyId() {
      // 初始化第一条数据
      let classifyID = this.data.articleTitles[0].keyID;
      let orgID = this.data.articleTitles[0].orgID;
      let currentCategoryData = this.data.articleDatas[classifyID];
      currentCategoryData["loading"] = true;
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex,
        "classifyID": classifyID,
        "isPublish": 1,
        "doctorCanSee": this.data.doctorStaffID,
        "departmentCanSee": this.data.departmentCanSee
      }).then(res => {
        currentCategoryData["loading"] = false;
        if (res.code == 0 && res.data) {
          let list = res.data;
          if (list.datas) {
            currentCategoryData["noData"] = list.datas.length === 0 ? true : false
            currentCategoryData["noMore"] = list.pageIndex < list.totalPage ? false : true
            currentCategoryData["noOnePage"] = list.datas.length < currentCategoryData.pageSize
            if (list.pageIndex < list.totalPage) {
              currentCategoryData["pageIndex"] += 1;
            }
            currentCategoryData.datas = list.datas;
            this.data.articleDatas[classifyID] = currentCategoryData;
            this.data.currentCategoryData = currentCategoryData;
            this.setData({
              currentCategoryData: currentCategoryData
            });
            this.queryStatisticsList(currentCategoryData, classifyID);
          }
        }
      })
    },
    /**
     *  获取统计数据
     */
    queryStatisticsList(currentCategoryData, classifyID) {
      if (currentCategoryData.datas.length === 0) {
        return;
      }
      var objectIDList = []
      currentCategoryData.datas.forEach(function(element) {
        objectIDList.push(element.keyID);
      });

      let usefulParams = {
        "systemCode": "tmc",
        "bizCode": "article",
        "objectIDList": objectIDList,
        "statisticsCode": "useful"
      };
      let viewParams = {
        "systemCode": "tmc",
        "bizCode": "article",
        "objectIDList": objectIDList,
        "statisticsCode": "view"
      };

      HTTP.queryStatisticsList(usefulParams).then(res => {
        if (res.code === 0 && res.data) {
          // console.log('usefulParams----', res.data);
          currentCategoryData.datas.forEach(function (item) {
            res.data.forEach(element => {
              if (item.keyID === element.objectID) {
                item.usefulNum = element.statisticsCount
              }
            })
          });
          this.data.articleDatas[classifyID] = currentCategoryData;
          this.data.currentCategoryData = currentCategoryData;
          this.setData({
            currentCategoryData: currentCategoryData
          });
        }
      });
      HTTP.queryStatisticsList(viewParams).then(res => {
        if (res.code === 0 && res.data) {
          
          currentCategoryData.datas.forEach(function (item) {
            res.data.forEach(element => {
              
              if (item.keyID === element.objectID) {
                item.viewNum = element.statisticsCount
              }
            })
          });
          this.data.articleDatas[classifyID] = currentCategoryData;
          this.data.currentCategoryData = currentCategoryData;
          this.setData({
            currentCategoryData: currentCategoryData
          });
        }
      });
      
    },
    /**
     * 点击tab\
     */
    titleClick: function(e) {
      var index = e.currentTarget.dataset.idx;
      if (this.data.currentIndex == index) {
        return false;
      } else {
        this.data.currentIndex = index;
        this.setData({
          currentIndex: index
        })
        let navitem = this.data.articleTitles[index];
        let currentClassifyID = navitem.keyID;
        let currentCategoryData = this.data.articleDatas[currentClassifyID];
        if (currentCategoryData.datas && currentCategoryData.datas.length > 0) {
          // 这里先渲染再切换界面
          this.setData({
            currentCategoryData: currentCategoryData
          })
        } else {
          this.loadDatas(currentClassifyID, currentCategoryData, navitem.orgID)
        }
      }
    },
    /**
     * 根据文章id获取文章的列表
     */
    loadDatas(currentClassifyID, currentCategoryData, orgID) {
      // 先网络加载提示 再进行请求操作
      this.setData({
        currentCategoryData: {
          loading: true,
          datas: []
        }
      }, function() {
        HTTP.articleByClassifyId({
          "orgID": orgID,
          "pageSize": currentCategoryData.pageSize,
          "pageIndex": currentCategoryData.pageIndex,
          "classifyID": currentClassifyID,
          "isPublish": 1,
          "doctorCanSee": this.data.doctorStaffID,
          "departmentCanSee": this.data.departmentCanSee
        }).then(res => {
          currentCategoryData["loading"] = false
          let list = res.data
          if (list.datas) {
            currentCategoryData["noData"] = list.datas.length === 0 ? true : false
            currentCategoryData["noMore"] = list.pageIndex < list.totalPage ? false : true
            currentCategoryData["noOnePage"] = list.datas.length < currentCategoryData.pageSize
            if (list.pageIndex < list.totalPage) {
              currentCategoryData["pageIndex"] += 1
            }
            currentCategoryData.datas = list.datas
            this.data.articleDatas[currentClassifyID] = currentCategoryData
            this.queryStatisticsList(currentCategoryData, currentClassifyID);
          }
          this.setData({
            currentCategoryData: currentCategoryData
          })
        }).catch(error => {
          currentCategoryData["noOnePage"] = true
          currentCategoryData["noMore"] = false;
          currentCategoryData["noData"] = false;
          currentCategoryData["loading"] = false;
          this.setData({
            currentCategoryData: currentCategoryData
          })
          wx.showToast({
            title: '网络连接失败',
          })
        });
      })

    },
    /**
     * 点击加载获取更多的数据
     */
    uploadMoreDatas(e) {
      let navitem = this.data.articleTitles[this.data.currentIndex]
      let currentClassifyID = navitem.keyID
      let orgID = navitem.orgID
      let currentCategoryData = this.data.articleDatas[currentClassifyID]
      if (currentCategoryData.loading || currentCategoryData.noMore) {
        return
      }
      // 先网络加载提示 再进行请求操作
      currentCategoryData["loading"] = true;
      this.setData({
        currentCategoryData: currentCategoryData
      }, function() {
        HTTP.articleByClassifyId({
          "orgID": orgID,
          "pageSize": currentCategoryData.pageSize,
          "pageIndex": currentCategoryData.pageIndex,
          "classifyID": currentClassifyID,
          "isPublish": 1,
          "doctorCanSee": this.data.doctorStaffID,
          "departmentCanSee": this.data.departmentCanSee
        }).then(res => {
          currentCategoryData["loading"] = false
          let list = res.data

          if (list.datas) {
            currentCategoryData["noOnePage"] = false
            currentCategoryData["noData"] = list.datas.length === 0 ? true : false
            currentCategoryData["noMore"] = list.pageIndex < list.totalPage ? false : true
            if (list.pageIndex < list.totalPage) {
              currentCategoryData["pageIndex"] += 1
            }
            currentCategoryData.datas = [...currentCategoryData.datas, ...list.datas]
            this.queryStatisticsList(currentCategoryData, currentClassifyID);
            this.setData({
              currentCategoryData: currentCategoryData
            })

          } else {
            // 不许渲染数据
          }
        }).catch(error => {
          currentCategoryData["noOnePage"] = false
          currentCategoryData["noMore"] = false;
          currentCategoryData["noData"] = false;
          currentCategoryData["loading"] = false;
          this.setData({
            currentCategoryData: currentCategoryData
          })
          wx.showToast({
            title: '网络连接失败',
          })
        })
      })

    },
    /**
     * 详情查看
     */
    itemDetails(e) {
      let item = e.currentTarget.dataset.item;
      this.data.itemIndex = e.currentTarget.dataset.index;
      let params = {
        title: this.data.articleTitles[this.data.currentIndex].classifyName,
        keyID: item.keyID,
        useful: item.useful,
        viewCount: item.viewCount
      }
      
      wx.navigateTo({
        url: "/pages/index/service-index/fzm/service-news-details/service-news-details?materialData=" + JSON.stringify(params),
      })

    },
    /**
     * 刷新当前数据 子组件即时刷新
     */
    refreshCurrentArticleUsefulNum: function() {
      
      var index = this.data.currentIndex;
      let navitem = this.data.articleTitles[index];
      let currentClassifyID = navitem.keyID;
      let currentCategoryData = this.data.articleDatas[currentClassifyID];
      let item = currentCategoryData.datas[this.data.itemIndex];
      if (!item.usefulNum) {
        item.usefulNum = 0;
      }
      item.usefulNum += 1;
      console.log('refreshCurrentArticleUsefulNum------222--', item)
    }
  }
})