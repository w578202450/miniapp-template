


Page({
  data: {

  },
  onLoad: function () {

  }
})

Component({
  properties: {
    gridsList: {
      type: Array
    },
    hidden: {
      type: Boolean
    }
  },
  data: {

  },
  methods: {
    // 返回事件   
    gridsChange: function (e) {

      var index = e.currentTarget.dataset.index;
      var item = this.data.gridsList[index];
      item.checked = !item.checked
      this.setData({
        gridsList: this.data.gridsList
      });

      this.triggerEvent('gridsChange', index)
    },

    addItemAction: function () {
      this.triggerEvent('addItemAction')
    }
  }
})