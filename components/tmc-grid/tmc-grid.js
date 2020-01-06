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
    }
  },
  data: {

  },
  methods: {
    // 返回事件   
    gridsChange: function (e) {
      this.triggerEvent('gridsChange', e.currentTarget.dataset.name)
      var checked = e.currentTarget.dataset.name
      var changed = {}
      for (var i = 0; i < this.data.gridsList.length; i++) {
        if (checked == this.data.gridsList[i].name) {
          changed['gridsList[' + i + '].checked'] = true
        } else {
          changed['gridsList[' + i + '].checked'] = false
        }
      }
      this.setData(changed)
      
    },

    addItemAction:function(){
      this.triggerEvent('addItemAction')
    }
  }
})