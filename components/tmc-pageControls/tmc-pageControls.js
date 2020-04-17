// components/tmc-pageControls/tmc-pageControls.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 分页控件信息
     * pageIndex 页数
     * pageSize 每页显示数量
     */
    pageInfo: {
      type: Object,
      value: {
        pageIndex: 1,
        pageSize: 10
      }
    },
    /**
     * 分页数据  
     * 当前页加载的数据列表
     */
    pageDatas: {
      type: Array,
      value: [],
      observer: function(value) {
        this.handlePageDatas(value)
      }
    },
    tipInfo:{
      type:Object,
      value: {
        noData: "没有数据", // 数据为空的情况
        moreData: "点击加载更多", // 可以点击 加载更多 进行分页请求
        noMoreData: "已经到底了" // 没有更多数据 当前页数据不够一页
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tipText: "已经到底了", // 初始值
    currentState: 0 // 0 noData 1: moreData 2:noMoreData
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 加载更多
     */
    loadMoreData() {
      if (this.data.currentState != 1) {
        return false;
      }
      console.log('加载更多。。')
      this.triggerEvent("loadMoreData")
    },
    /**
     * 通过分页数据的数量与pageSize比对
     */
    handlePageDatas(dataList) {
      console.log('dataList------', dataList)
      // 没有数据 或者 已经到底了
      if (dataList.length === 0) {
        if (this.data.pageInfo.pageIndex > 1) {
          this.setData({
            tipText: this.data.tipInfo.noMoreData,
            currentState: 2
          })
        } else {
          this.setData({
            tipText: this.data.tipInfo.noData,
            currentState: 0
          })
        }

        return false;
      }
      if (dataList.length < this.data.pageInfo.pageSize){
        this.setData({
          tipText: this.data.tipInfo.noMoreData,
          currentState: 2
        })
        return false;
      }
      // 加载更多
      if (dataList.length === this.data.pageInfo.pageSize) {
        this.setData({
          tipText: this.data.tipInfo.moreData,
          currentState: 1
        })
        return false;
      }
    }
  }
})