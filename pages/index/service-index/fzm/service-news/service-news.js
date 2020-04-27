var appBehavior = require('../behaviors/fzm-behaviors')
const HTTP = require('../../../../../utils/http-util');
const app = getApp()

Component({
  behaviors: [appBehavior],
  properties: {
    /**
     * 文章标题对象
     * 传入时监听对象的变化 进行相应的数据请求
     */
    articleTitles: {
      type: Array,
      value: [],
      observer: function(newValue, oldValue) {
        this.observeArticleTitles(newValue);
      }
    },
    /**
     * 查询文章列表基本条件
     * isPublish 是否已发布
     * doctorCanSee 对应医生
     * departmentCanSee 对应科室
     */
    baseParams: {
      type: Object,
      value: {
        "isPublish": 1,
        "doctorCanSee": "",
        "departmentCanSee": ""
      }
    }
  },

  data: {
    /**
     * 文本信息
     */
    textInfo: {
      loading: "正在加载中...",
      noData: "暂无数据",
      noMoreData: "已经到底了",
      loadMoreData: "点击加载更多"
    },
    itemIndex: 0, // 点击文章列表index
    currentIndex: 0, // 标题分类选项卡index
    currentClassifyID: '', // 当前文章分类id
    articleDatas: {}, // 全部文章数据对象
    currentCategoryData: { // 当前选择的分类文章数据对象
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
   * 组件的方法列表
   */
  methods: {
    /**
     * 根据观察机制来完成数据初始化
     * 1.首页文章列数据初始化
     * 2.文章列表观看统计计数查询
     * 3.文章列表觉得有用统计计数查询
     */
    observeArticleTitles(obj) {
      if (!obj || Object.keys(obj).length === 0) {
        return;
      }
      let articleDatas = {};
      obj.forEach((item) => {
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
    },
    /**
     * 分类切换
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
     *  获取统计数据
     */
    handleStatisticsDatas(currentCategoryData, classifyID) {
      if (currentCategoryData.datas.length === 0) {
        return;
      }
      var objectIDList = []
      currentCategoryData.datas.forEach(function(element) {
        objectIDList.push(element.keyID);
      });

      this.usefulStatisticsListRequest(currentCategoryData, classifyID, objectIDList);
      this.viewStatisticsListRequest(currentCategoryData, classifyID, objectIDList);
    },
    /**
     * 觉得有用计数列表查询
     */
    usefulStatisticsListRequest(currentCategoryData, classifyID, objectIDList) {
      let usefulParams = {
        "systemCode": "tmc",
        "bizCode": "article",
        "objectIDList": objectIDList,
        "statisticsCode": "useful"
      };
      HTTP.queryStatisticsList(usefulParams).then(res => {
        if (res.code === 0 && res.data) {
          currentCategoryData.datas.forEach(function(item) {
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
    },
    /**
     * 观看数列表计数列表查询
     */
    viewStatisticsListRequest(currentCategoryData, classifyID, objectIDList) {
      let viewParams = {
        "systemCode": "tmc",
        "bizCode": "article",
        "objectIDList": objectIDList,
        "statisticsCode": "view"
      };
      HTTP.queryStatisticsList(viewParams).then(res => {
        if (res.code === 0 && res.data) {

          currentCategoryData.datas.forEach(function(item) {
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
     * 初始化文章数据 取第一条数据
     */
    articleByClassifyId() {
      let classifyID = this.data.articleTitles[0].keyID;
      let orgID = this.data.articleTitles[0].orgID;
      let currentCategoryData = this.data.articleDatas[classifyID];
      currentCategoryData["loading"] = true;
      HTTP.articleByClassifyId({
        "orgID": orgID,
        "pageSize": currentCategoryData.pageSize,
        "pageIndex": currentCategoryData.pageIndex,
        "classifyID": classifyID,
        ...this.data.baseParams
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
            this.handleStatisticsDatas(currentCategoryData, classifyID);
          }
        }
      })
    },
    /**
     * 根据文章id获取文章的列表
     */
    loadDatas(currentClassifyID, currentCategoryData, orgID) {
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
          ...this.data.baseParams
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
            this.handleStatisticsDatas(currentCategoryData, currentClassifyID);
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
          ...this.data.baseParams
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
            this.handleStatisticsDatas(currentCategoryData, currentClassifyID);
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
        departmentId: this.data.baseParams.departmentCanSee,
        doctorId: this.data.baseParams.doctorCanSee
      }
      wx.navigateTo({
        url: "/pages/index/service-index/fzm/service-news-details/service-news-details?httpParams=" + JSON.stringify(params),
      })

    },
    /**
     * 当前item 更新点赞有用数
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
      this.setData({
        currentCategoryData: currentCategoryData
      })
    },

    /**
     * 当前item 更新观看数
     */
    refreshArticleViewNum() {
      var index = this.data.currentIndex;
      let navitem = this.data.articleTitles[index];
      let currentClassifyID = navitem.keyID;
      let currentCategoryData = this.data.articleDatas[currentClassifyID];
      let item = currentCategoryData.datas[this.data.itemIndex];
      if (!item.viewNum) {
        item.viewNum = 0;
      }
      item.viewNum += 1;
      this.setData({
        currentCategoryData: currentCategoryData
      })
    }
  }

})